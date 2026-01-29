import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getStudentCards, getSubjects } from '../services/api';

/**
 * Lists the subjects along with their coefficients for the latest
 * enrolment.  The backend associates subjects with an opening offer
 * (openingTrainingOfferId) and a level ID; these values are obtained
 * from the most recent student card.
 */
export default function SubjectsPage() {
  const { user } = useAuth();
  const {
    data: subjects,
    error,
    isLoading,
  } = useQuery(
    ['subjects', user?.uuid],
    async () => {
      const cards = await getStudentCards(user.uuid, user.token);
      if (!cards.length) return [];
      const latest = [...cards].sort((a, b) => b.id - a.id)[0];
      const offerId = latest.ouvertureOffreFormationId || latest.openingTrainingOfferId;
      const levelId = latest.niveauId || latest.levelId;
      return await getSubjects(offerId, levelId, user.token);
    },
    { enabled: !!user }
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Subjects</h2>
      {isLoading && <p>Loading subjects…</p>}
      {error && <p className="text-red-600">Failed to load subjects: {error.message}</p>}
      {Array.isArray(subjects) && subjects.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Subject</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">CC Coef</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">CI Coef</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Exam Coef</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {subjects.map((s, idx) => (
                <tr
                  key={idx}
                  className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
                >
                  <td className="px-4 py-2 whitespace-nowrap">{s.mcLibelleFr}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{s.coefficientControleContinu}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{s.coefficientControleIntermediaire}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{s.coefficientExamen}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{s.periodeLibelleFr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && <p>No subjects found.</p>
      )}
    </div>
  );
}