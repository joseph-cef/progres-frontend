import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getStudentCards, getSubjects } from '../services/api';

/**
 * Lists the subjects along with their continuous control and exam
 * coefficients for the latest enrolment.  The backend associates
 * subjects with an opening training offer and a level ID; these
 * values are obtained from the most recent student card.
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
      if (!cards || !cards.length) return [];
      const latest = [...cards].sort((a, b) => b.id - a.id)[0];
      const offerId = latest.ouvertureOffreFormationId || latest.openingTrainingOfferId;
      const levelId = latest.niveauId || latest.levelId;
      return await getSubjects(offerId, levelId, user.token);
    },
    { enabled: !!user }
  );

  const hasData = Array.isArray(subjects) && subjects.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Subjects
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            List of registered subjects with continuous and exam coefficients.
          </p>
        </div>
        {hasData && (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
            {subjects.length} subject{subjects.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6">
          <div className="space-y-3">
            <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          Failed to load subjects: {error.message}
        </div>
      )}

      {/* No subjects */}
      {!isLoading && !error && !hasData && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
          No subjects found for your latest enrolment.
        </div>
      )}

      {/* Subjects table */}
      {hasData && !isLoading && !error && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Registered Subjects
            </h3>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      CC Coef
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Exam Coef
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
                  {subjects.map((s, idx) => (
                    <tr
                      key={idx}
                      className="transition-colors hover:bg-blue-50/60 dark:hover:bg-blue-900/10"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-100">
                        {s.mcLibelleFr}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          {s.coefficientControleContinu}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
                          {s.coefficientExamen}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
