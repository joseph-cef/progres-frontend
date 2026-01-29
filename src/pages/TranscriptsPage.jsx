import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import {
  getStudentCards,
  getAcademicTranscripts,
  getAcademicDecision,
} from '../services/api';

/**
 * Shows the student's academic transcripts.  Each transcript corresponds
 * to a period within an academic year.  The period name and overall
 * average are displayed in a list; clicking on a transcript reveals
 * the underlying units (UEs) and their constituent subjects with
 * grades and coefficients.  The academic decision for the year is
 * fetched once and displayed at the top of the page.
 */
export default function TranscriptsPage() {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(null);
  const {
    data: transcripts,
    error,
    isLoading,
  } = useQuery(
    ['transcripts', user?.uuid],
    async () => {
      const cards = await getStudentCards(user.uuid, user.token);
      if (!cards.length) return [];
      const latest = [...cards].sort((a, b) => b.id - a.id)[0];
      return await getAcademicTranscripts(user.uuid, latest.id, user.token);
    },
    { enabled: !!user }
  );

  const { data: decision } = useQuery(
    ['decision', user?.uuid],
    async () => {
      const cards = await getStudentCards(user.uuid, user.token);
      if (!cards.length) return null;
      const latest = [...cards].sort((a, b) => b.id - a.id)[0];
      return await getAcademicDecision(user.uuid, latest.id, user.token);
    },
    { enabled: !!user }
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Transcripts</h2>
      {decision && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <p>
            <span className="font-medium">Decision:</span> {decision.typeDecisionLibelleFr || '—'}
          </p>
          {decision.moyenne != null && (
            <p>
              <span className="font-medium">Year Average:</span> {decision.moyenne}
            </p>
          )}
        </div>
      )}
      {isLoading && <p>Loading transcripts…</p>}
      {error && <p className="text-red-600">Failed to load transcripts: {error.message}</p>}
      {Array.isArray(transcripts) && transcripts.length > 0 ? (
        <div className="space-y-2">
          {transcripts.map((tr, idx) => {
            const isOpen = expanded === idx;
            return (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded shadow">
                <button
                  onClick={() => setExpanded(isOpen ? null : idx)}
                  className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span>
                    {tr.periodeLibelleFr} ({tr.niveauLibelleLongLt})
                  </span>
                  <span className="font-medium">{tr.moyenne ?? '—'}</span>
                </button>
                {isOpen && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    {tr.bilanUes.map((ue, ueIdx) => (
                      <div key={ueIdx} className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <p className="font-semibold">
                          {ue.ueLibelleFr} – UE Avg: {ue.moyenne}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Credits: {ue.credit} / Acquired: {ue.creditAcquis}
                        </p>
                        <table className="min-w-full mt-2 divide-y divide-gray-300 dark:divide-gray-700 text-sm">
                          <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                              <th className="px-2 py-1 text-left">Subject</th>
                              <th className="px-2 py-1 text-left">Coefficient</th>
                              <th className="px-2 py-1 text-left">Credit</th>
                              <th className="px-2 py-1 text-left">Average</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {ue.bilanMcs.map((mc, mcIdx) => (
                              <tr key={mcIdx}>
                                <td className="px-2 py-1 whitespace-nowrap">{mc.mcLibelleFr}</td>
                                <td className="px-2 py-1 whitespace-nowrap">{mc.coefficient}</td>
                                <td className="px-2 py-1 whitespace-nowrap">{mc.creditObtenu}</td>
                                <td className="px-2 py-1 whitespace-nowrap">{mc.moyenneGenerale ?? '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        !isLoading && <p>No transcripts found.</p>
      )}
    </div>
  );
}
