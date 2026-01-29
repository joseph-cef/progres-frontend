import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getStudentCards, getExamGrades } from '../services/api';

/**
 * Shows the exam grades for the student's latest enrolment.  A row
 * includes the subject name, exam note, coefficient and the session
 * title.  If no note is present a dash is displayed instead.
 */
export default function ExamGradesPage() {
  const { user } = useAuth();
  const {
    data,
    error,
    isLoading,
  } = useQuery(
    ['examGrades', user?.uuid],
    async () => {
      const cards = await getStudentCards(user.uuid, user.token);
      if (!cards.length) return [];
      const latest = [...cards].sort((a, b) => b.id - a.id)[0];
      return await getExamGrades(latest.id, user.token);
    },
    { enabled: !!user }
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Exam Grades</h2>
      {isLoading && <p>Loading exam grades…</p>}
      {error && <p className="text-red-600">Failed to load grades: {error.message}</p>}
      {Array.isArray(data) && data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Subject</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Note</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Coefficient</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((item, idx) => (
                <tr
                  key={idx}
                  className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
                >
                  <td className="px-4 py-2 whitespace-nowrap">{item.mcLibelleFr}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{item.noteExamen ?? '–'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{item.rattachementMcCoefficient}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{item.planningSessionIntitule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && <p>No exam grades found.</p>
      )}
    </div>
  );
}