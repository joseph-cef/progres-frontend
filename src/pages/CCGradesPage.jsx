import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getStudentCards, getCCGrades } from '../services/api';

/**
 * Shows continuous control (CC) grades for the latest enrolment.  Each row
 * lists the subject, period, grade and any observation.  Absence is
 * indicated by a dash.  If the student has no CC grades the page
 * politely indicates so.
 */
export default function CCGradesPage() {
  const { user } = useAuth();
  const {
    data,
    error,
    isLoading,
  } = useQuery(
    ['ccGrades', user?.uuid],
    async () => {
      const cards = await getStudentCards(user.uuid, user.token);
      if (!cards.length) return [];
      const latest = [...cards].sort((a, b) => b.id - a.id)[0];
      return await getCCGrades(latest.id, user.token);
    },
    { enabled: !!user }
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">CC Grades</h2>
      {isLoading && <p>Loading CC grades…</p>}
      {error && <p className="text-red-600">Failed to load CC grades: {error.message}</p>}
      {Array.isArray(data) && data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Subject</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Period</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Note</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Observation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((g, idx) => (
                <tr
                  key={idx}
                  className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
                >
                  <td className="px-4 py-2 whitespace-nowrap">{g.rattachementMcMcLibelleFr}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{g.llPeriode}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{g.note ?? (g.absent ? 'Absent' : '–')}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{g.observation || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && <p>No CC grades found.</p>
      )}
    </div>
  );
}