import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getStudentCards, getCCGrades } from '../services/api';

export default function CCGradesPage() {
  const { user } = useAuth();

  const { data, error, isLoading } = useQuery(
    ['ccGrades', user?.uuid],
    async () => {
      const cards = await getStudentCards(user.uuid, user.token);
      if (!cards.length) return [];
      const latest = [...cards].sort((a, b) => b.id - a.id)[0];
      return await getCCGrades(latest.id, user.token);
    },
    { enabled: !!user }
  );

  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            CC Grades
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Continuous control results for the latest enrolment
          </p>
        </div>
        {hasData && (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            {data.length} subjects
          </span>
        )}
      </div>

      {/* Content */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6">
        {isLoading && (
          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
            Failed to load CC grades: {error.message}
          </div>
        )}

        {!isLoading && !error && !hasData && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No CC grades found.
          </p>
        )}

        {hasData && (
          <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
                  {data.map((g, idx) => {
                    const typeLabel = g.apCode; // "TP" أو "TD"

                    return (
                      <tr
                        key={idx}
                        className="transition-colors hover:bg-emerald-50/60 dark:hover:bg-emerald-900/10"
                      >
                        {/* Subject */}
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-100">
                          {g.rattachementMcMcLibelleFr}
                        </td>

                        {/* Type: TP / TD */}
                        <td className="px-4 py-3">
                          {typeLabel ? (
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
                                ${
                                  typeLabel === 'TP'
                                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200'
                                    : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
                                }`}
                            >
                              {typeLabel}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">–</span>
                          )}
                        </td>

                        {/* Note: أحمر تحت 10 ، أخضر من 10 فما فوق ، Absent رمادي */}
                        <td className="px-4 py-3">
                          {g.note !== null && g.note !== undefined ? (
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold
                                ${
                                  g.note < 10
                                    ? 'bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-300'
                                    : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
                                }`}
                            >
                              {g.note}
                            </span>
                          ) : g.absent ? (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                              Absent
                            </span>
                          ) : (
                            <span className="text-gray-400">–</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
