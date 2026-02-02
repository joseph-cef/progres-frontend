import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getStudentCards, getCCGrades } from '../services/api';

function parseAcademicYearStart(label, fallbackIndex) {
  if (typeof label === 'string') {
    const match = label.match(/(\d{4})/);
    if (match) return Number(match[1]);
  }
  return fallbackIndex + 1;
}

function parseSemesterIndex(label) {
  if (typeof label === 'string') {
    const match = label.match(/(\d+)/);
    if (match) return Number(match[1]);
  }
  return 1;
}

export default function CCGradesPage() {
  const { user } = useAuth();

  const { data, error, isLoading } = useQuery(
    ['ccGradesAllYears', user?.uuid],
    async () => {
      const cards = await getStudentCards(user.uuid, user.token);
      if (!cards.length) return [];

      const sortedCards = [...cards].sort((a, b) => a.id - b.id);

      const all = await Promise.all(
        sortedCards.map(async (card, idx) => {
          const grades = await getCCGrades(card.id, user.token);

          const yearLabel =
            card.llAnnee ||
            card.anneeAcademique ||
            card.annee ||
            card.annee_univ ||
            card.anneeUniversitaire ||
            null;

          const yearStart = parseAcademicYearStart(yearLabel, idx);

          return grades.map((g) => ({
            ...g,
            cardId: card.id,
            academicYearStart: yearStart,
            semesterIndex: parseSemesterIndex(g.llPeriode),
          }));
        })
      );

      return all.flat();
    },
    { enabled: !!user }
  );

  const hasData = Array.isArray(data) && data.length > 0;

  const years = useMemo(() => {
    if (!hasData) return [];
    const map = new Map();

    data.forEach((g) => {
      const key = g.cardId;
      if (!map.has(key)) {
        map.set(key, {
          key,
          academicYearStart: g.academicYearStart,
        });
      }
    });

    const arr = Array.from(map.values());
    arr.sort((a, b) => a.academicYearStart - b.academicYearStart);
    return arr;
  }, [data, hasData]);

  const [activeYearKey, setActiveYearKey] = useState(null);
  const [activeSemester, setActiveSemester] = useState(null);

  useEffect(() => {
    if (years.length && !activeYearKey) {
      setActiveYearKey(years[years.length - 1].key);
    }
  }, [years, activeYearKey]);

  const semesters = useMemo(() => {
    if (!hasData || !activeYearKey) return [];

    const subset = data.filter((g) => g.cardId === activeYearKey);
    const map = new Map();

    subset.forEach((g) => {
      const key = g.llPeriode;
      if (!key) return;
      if (!map.has(key)) {
        map.set(key, {
          key,
          label: g.llPeriode,
          index: g.semesterIndex,
        });
      }
    });

    const arr = Array.from(map.values());
    arr.sort((a, b) => a.index - b.index);
    return arr;
  }, [data, hasData, activeYearKey]);

  useEffect(() => {
    if (semesters.length && !activeSemester) {
      setActiveSemester(semesters[semesters.length - 1].key);
    }
  }, [semesters, activeSemester]);

  const visibleGrades = useMemo(() => {
    if (!hasData || !activeYearKey || !activeSemester) return [];
    return data.filter(
      (g) => g.cardId === activeYearKey && g.llPeriode === activeSemester
    );
  }, [data, hasData, activeYearKey, activeSemester]);

  const activeSemesterObj =
    semesters.find((s) => s.key === activeSemester) || null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            CC Grades
          </h2>
          {activeSemesterObj && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Semester:{' '}
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {activeSemesterObj.label}
              </span>
            </p>
          )}
        </div>
        {hasData && (
          <span className="inline-flex items-center self-start rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 sm:self-auto">
            {visibleGrades.length} entries
          </span>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-4 md:p-6">
        {isLoading && (
          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300 sm:px-4 sm:py-3 sm:text-sm">
            Failed to load CC grades: {error.message}
          </div>
        )}

        {!isLoading && !error && !hasData && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No CC grades found.
          </p>
        )}

        {hasData && (
          <>
            <div className="-mx-3 mb-3 flex gap-2 overflow-x-auto pb-1 sm:mx-0 sm:mb-4">
              {years.map((y) => {
                const active = y.key === activeYearKey;
                return (
                  <button
                    key={y.key}
                    onClick={() => {
                      setActiveYearKey(y.key);
                      setActiveSemester(null);
                    }}
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors
                      ${
                        active
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200'
                      }`}
                  >
                    {y.academicYearStart}
                  </button>
                );
              })}
            </div>

            <div className="-mx-3 mb-3 flex gap-2 overflow-x-auto pb-1 sm:mx-0 sm:mb-4">
              {semesters.map((s) => {
                const active = s.key === activeSemester;
                return (
                  <button
                    key={s.key}
                    onClick={() => setActiveSemester(s.key)}
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors
                      ${
                        active
                          ? 'border-sky-600 bg-sky-600 text-white'
                          : 'border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200'
                      }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>

            {visibleGrades.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No grades for this semester.
              </p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-xs dark:divide-gray-700 sm:text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800/80">
                      <tr>
                        <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:px-4 sm:py-3 sm:text-xs">
                          Subject
                        </th>
                        <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:px-4 sm:py-3 sm:text-xs">
                          Type
                        </th>
                        <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:px-4 sm:py-3 sm:text-xs">
                          Note
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
                      {visibleGrades.map((g, idx) => (
                        <tr
                          key={idx}
                          className="transition-colors hover:bg-emerald-50/60 dark:hover:bg-emerald-900/10"
                        >
                          <td className="px-2 py-2 text-xs font-medium text-gray-800 dark:text-gray-100 sm:px-4 sm:py-3 sm:text-sm">
                            {g.rattachementMcMcLibelleFr}
                          </td>

                          <td className="px-2 py-2 sm:px-4 sm:py-3">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold sm:px-3 sm:py-1 sm:text-xs
                                ${
                                  g.apCode === 'TP'
                                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200'
                                    : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
                                }`}
                            >
                              {g.apCode}
                            </span>
                          </td>

                          <td className="px-2 py-2 sm:px-4 sm:py-3">
                            {g.note !== null && g.note !== undefined ? (
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold sm:px-3 sm:py-1 sm:text-sm
                                  ${
                                    g.note < 10
                                      ? 'bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-300'
                                      : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
                                  }`}
                              >
                                {g.note}
                              </span>
                            ) : g.absent ? (
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300 sm:px-3 sm:py-1 sm:text-sm">
                                Absent
                              </span>
                            ) : (
                              <span className="text-gray-400">–</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
