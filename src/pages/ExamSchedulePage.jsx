import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import {
  getStudentCards,
  getCurrentAcademicYear,
  getAcademicPeriods,
  getExamSchedule,
} from '../services/api';

/**
 * Displays the exam schedule for the student's latest enrolment.  The
 * schedule is compiled by iterating through each academic period in
 * the current year and collecting the exam sessions for the
 * student's level.  The resulting entries are sorted chronologically.
 */
export default function ExamSchedulePage() {
  const { user } = useAuth();
  const { data, error, isLoading } = useQuery(
    ['examSchedule', user?.uuid],
    async () => {
      const cards = await getStudentCards(user.uuid, user.token);
      if (!cards.length) return [];
      const latest = [...cards].sort((a, b) => b.id - a.id)[0];
      // levelId is required for exam schedule endpoint
      const levelId = latest.niveauId || latest.levelId;
      // Fetch current academic year and its periods
      const year = await getCurrentAcademicYear(user.token);
      const periods = await getAcademicPeriods(year.id, user.token);
      const schedulesPerPeriod = await Promise.all(
        periods.map((p) => getExamSchedule(p.id, levelId, user.token))
      );
      // Flatten and annotate with period label
      const annotated = schedulesPerPeriod.flat().map((s) => ({ ...s }));
      // Sort by date then time
      annotated.sort((a, b) => {
        const dateA = `${a.dateExamen} ${a.heureDebut || ''}`;
        const dateB = `${b.dateExamen} ${b.heureDebut || ''}`;
        return dateA.localeCompare(dateB);
      });
      return annotated;
    },
    { enabled: !!user }
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Exam Schedule</h2>
      {isLoading && <p>Loading exam schedule…</p>}
      {error && <p className="text-red-600">Failed to load exam schedule: {error.message}</p>}
      {Array.isArray(data) && data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Time</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Subject</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Period</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((item, idx) => (
                <tr
                  key={idx}
                  className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
                >
                  <td className="px-4 py-2 whitespace-nowrap">{item.dateExamen}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {item.heureDebut}
                    {item.heureFin ? ` – ${item.heureFin}` : ''}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{item.mcLibelleFr}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{item.libellePeriode}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{item.typeSession}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && <p>No exam schedule found.</p>
      )}
    </div>
  );
}
