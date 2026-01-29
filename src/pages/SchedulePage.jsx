import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getStudentCards, getSubjectSchedule } from '../services/api';

/**
 * Shows the weekly timetable for the student's latest enrolment.  A
 * schedule entry includes the day of week, the start and end times,
 * subject name, group, teacher and location.  Entries are sorted by
 * day and start time for convenience.
 */
export default function SchedulePage() {
  const { user } = useAuth();
  const { data, error, isLoading } = useQuery(
    ['schedule', user?.uuid],
    async () => {
      const cards = await getStudentCards(user.uuid, user.token);
      if (cards.length === 0) return [];
      const latest = [...cards].sort((a, b) => b.id - a.id)[0];
      return await getSubjectSchedule(latest.id, user.token);
    },
    { enabled: !!user }
  );

  // Sort entries by day and then by start time if available.
  const sorted = Array.isArray(data)
    ? [...data].sort((a, b) => {
        const dayA = a.jourId ?? 0;
        const dayB = b.jourId ?? 0;
        if (dayA !== dayB) return dayA - dayB;
        const timeA = a.plageHoraireHeureDebut || '';
        const timeB = b.plageHoraireHeureDebut || '';
        return timeA.localeCompare(timeB);
      })
    : [];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Schedule</h2>
      {isLoading && <p>Loading schedule…</p>}
      {error && <p className="text-red-600">Failed to load schedule: {error.message}</p>}
      {sorted.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Day</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Time</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Subject</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Group</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Teacher</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sorted.map((s, idx) => (
                <tr
                  key={idx}
                  className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
                >
                  <td className="px-4 py-2 whitespace-nowrap">{s.jourLibelleFr || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {s.plageHoraireHeureDebut && s.plageHoraireHeureFin
                      ? `${s.plageHoraireHeureDebut} – ${s.plageHoraireHeureFin}`
                      : s.plageHoraireLibelleFr || '-'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{s.matiere}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{s.groupe}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {s.prenomEnseignantLatin || ''} {s.nomEnseignantLatin || ''}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{s.refLieuDesignation || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && <p>No schedule found.</p>
      )}
    </div>
  );
}
