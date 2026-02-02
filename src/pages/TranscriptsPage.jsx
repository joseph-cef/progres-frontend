import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import {
  getStudentCards,
  getAcademicTranscripts,
  getAcademicDecision,
} from '../services/api';

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

export default function TranscriptsPage() {
  const { user } = useAuth();
  const [activeYearKey, setActiveYearKey] = useState(null);
  const [activeSemesterKey, setActiveSemesterKey] = useState(null);

  const {
    data: yearsData,
    error,
    isLoading,
  } = useQuery(
    ['transcriptsAllYears', user?.uuid],
    async () => {
      const cards = await getStudentCards(user.uuid, user.token);
      if (!cards.length) return [];

      const sortedCards = [...cards].sort((a, b) => a.id - b.id);

      const results = [];

      for (let i = 0; i < sortedCards.length; i++) {
        const card = sortedCards[i];

        const yearLabel =
          card.llAnnee ||
          card.anneeAcademique ||
          card.annee ||
          card.annee_univ ||
          card.anneeUniversitaire ||
          null;

        const academicYearStart = parseAcademicYearStart(yearLabel, i);

        const [transcripts, decision] = await Promise.all([
          getAcademicTranscripts(user.uuid, card.id, user.token),
          getAcademicDecision(user.uuid, card.id, user.token).catch(() => null),
        ]);

        const enrichedTranscripts = Array.isArray(transcripts)
          ? transcripts.map((tr, idxTr) => ({
              ...tr,
              semesterIndex: parseSemesterIndex(tr.periodeLibelleFr),
              _internalKey: `${card.id}-${idxTr}`,
            }))
          : [];

        results.push({
          cardId: card.id,
          academicYearStart,
          yearLabel: yearLabel || `${academicYearStart}-${academicYearStart + 1}`,
          decision: decision || null,
          transcripts: enrichedTranscripts,
        });
      }

      results.sort((a, b) => a.academicYearStart - b.academicYearStart);
      return results;
    },
    { enabled: !!user }
  );

  const hasData = Array.isArray(yearsData) && yearsData.length > 0;

   const years = useMemo(() => {
    if (!hasData) return [];
    const arr = [...yearsData];
    arr.sort((a, b) => a.academicYearStart - b.academicYearStart);
    return arr;
  }, [yearsData, hasData]);

  const activeYear = useMemo(
    () =>
      hasData && activeYearKey
        ? yearsData.find((y) => y.cardId === activeYearKey) || null
        : null,
    [yearsData, hasData, activeYearKey]
  );

   const activeYearDisplayIndex = useMemo(() => {
    if (!activeYear) return null;
    const idx = years.findIndex((y) => y.cardId === activeYear.cardId);
    return idx === -1 ? null : idx + 1;
  }, [activeYear, years]);

  const semesters = useMemo(() => {
    if (!activeYear) return [];

    const map = new Map();
    activeYear.transcripts.forEach((tr) => {
      const key = tr.periodeLibelleFr;
      if (!key) return;
      if (!map.has(key)) {
        map.set(key, {
          key,
          label: tr.periodeLibelleFr,
          index: tr.semesterIndex,
        });
      }
    });

    const arr = Array.from(map.values());
    arr.sort((a, b) => a.index - b.index);
    return arr;
  }, [activeYear]);

  const activeSemesterInfo = useMemo(
    () =>
      semesters.length && activeSemesterKey
        ? semesters.find((s) => s.key === activeSemesterKey) || null
        : null,
    [semesters, activeSemesterKey]
  );

  const activeTranscript = useMemo(() => {
    if (!activeYear || !activeSemesterKey) return null;
    const list = activeYear.transcripts.filter(
      (tr) => tr.periodeLibelleFr === activeSemesterKey
    );
    if (!list.length) return null;
    return list[0];
  }, [activeYear, activeSemesterKey]);

  const rows = useMemo(() => {
    if (!activeTranscript || !Array.isArray(activeTranscript.bilanUes)) return [];

    const result = [];
    activeTranscript.bilanUes.forEach((ue) => {
      if (Array.isArray(ue.bilanMcs)) {
        ue.bilanMcs.forEach((mc) => {
          result.push({
            ueLibelleFr: ue.ueLibelleFr,
            mcLibelleFr: mc.mcLibelleFr,
            coefficient: mc.coefficient,
            creditObtenu: mc.creditObtenu,
            moyenneGenerale: mc.moyenneGenerale,
          });
        });
      }
    });
    return result;
  }, [activeTranscript]);

  useEffect(() => {
    if (!hasData || !yearsData.length) return;

     if (!activeYearKey) {
      const lastYear = years[years.length - 1];
      if (lastYear) {
        setActiveYearKey(lastYear.cardId);
        return;
      }
    }

     if (activeYearKey && !activeSemesterKey) {
      const year = yearsData.find((y) => y.cardId === activeYearKey);
      if (year && year.transcripts && year.transcripts.length) {
        const sorted = [...year.transcripts].sort(
          (a, b) => a.semesterIndex - b.semesterIndex
        );
        const lastSemester = sorted[sorted.length - 1];
        if (lastSemester) {
          setActiveSemesterKey(lastSemester.periodeLibelleFr);
        }
      }
    }
  }, [hasData, yearsData, years, activeYearKey, activeSemesterKey]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Transcripts
          </h2>
          {hasData && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Academic history by year and semester
            </p>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-4 md:p-6">
          <div className="space-y-3">
            <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-10 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-32 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300 sm:px-4 sm:py-3 sm:text-sm">
          Failed to load transcripts: {error.message}
        </div>
      )}

      {!isLoading && !error && !hasData && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No transcripts found.
        </p>
      )}

      {!isLoading && hasData && (
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-4 md:p-6">
           <div className="-mx-3 flex gap-2 overflow-x-auto pb-1 sm:mx-0">
            {years.map((y, idx) => {
              const active = y.cardId === activeYearKey;
              const label = `Year ${idx + 1}`;
              return (
                <button
                  key={y.cardId}
                  onClick={() => {
                    setActiveYearKey(y.cardId);
                    setActiveSemesterKey(null);
                  }}
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors
                    ${
                      active
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200'
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

           <div className="-mx-3 flex gap-2 overflow-x-auto pb-1 sm:mx-0">
            {semesters.map((s) => {
              const active = s.key === activeSemesterKey;
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveSemesterKey(s.key)}
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

           {activeYear && (
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                  {activeYearDisplayIndex
                    ? `Year ${activeYearDisplayIndex}`
                    : 'Year'}
                </p>
                {activeYear.yearLabel && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Academic year:{' '}
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {activeYear.yearLabel}
                    </span>
                  </p>
                )}
                {activeYear.decision?.typeDecisionLibelleFr && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Decision:{' '}
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {activeYear.decision.typeDecisionLibelleFr}
                    </span>
                  </p>
                )}
              </div>

              {activeYear.decision?.moyenne !== null &&
                activeYear.decision?.moyenne !== undefined && (
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
                      ${
                        activeYear.decision.moyenne < 10
                          ? 'bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-300'
                          : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
                      }`}
                  >
                    Year Average: {activeYear.decision.moyenne}
                  </span>
                )}
            </div>
          )}

           {activeTranscript && (
            <div className="space-y-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                    {activeTranscript.periodeLibelleFr}
                  </p>
                  {activeTranscript.niveauLibelleLongLt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activeTranscript.niveauLibelleLongLt}
                    </p>
                  )}
                </div>
                {activeTranscript.moyenne !== null &&
                  activeTranscript.moyenne !== undefined && (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
                        ${
                          activeTranscript.moyenne < 10
                            ? 'bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-300'
                            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
                        }`}
                    >
                      Semester Average: {activeTranscript.moyenne}
                    </span>
                  )}
              </div>

               {rows.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No detailed marks for this semester.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-xs dark:divide-gray-700 sm:text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:px-3 sm:py-2 sm:text-xs">
                          UE
                        </th>
                        <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:px-3 sm:py-2 sm:text-xs">
                          Subject
                        </th>
                        <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:px-3 sm:py-2 sm:text-xs">
                          Coef
                        </th>
                        <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:px-3 sm:py-2 sm:text-xs">
                          Credit
                        </th>
                        <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:px-3 sm:py-2 sm:text-xs">
                          Average
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
                      {rows.map((row, idx) => {
                        const avg = row.moyenneGenerale ?? null;
                        const hasAvg =
                          avg !== null &&
                          avg !== undefined &&
                          !Number.isNaN(avg);

                        let avgClass =
                          'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
                        if (hasAvg) {
                          if (avg < 10) {
                            avgClass =
                              'bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-300';
                          } else {
                            avgClass =
                              'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300';
                          }
                        }

                        return (
                          <tr key={idx}>
                            <td className="px-2 py-2 text-xs text-gray-900 dark:text-gray-100 sm:px-3 sm:py-2 sm:text-sm">
                              {row.ueLibelleFr}
                            </td>
                            <td className="px-2 py-2 text-xs text-gray-900 dark:text-gray-100 sm:px-3 sm:py-2 sm:text-sm">
                              {row.mcLibelleFr}
                            </td>
                            <td className="px-2 py-2 text-xs text-gray-700 dark:text-gray-300 sm:px-3 sm:py-2 sm:text-sm">
                              {row.coefficient}
                            </td>
                            <td className="px-2 py-2 text-xs text-gray-700 dark:text-gray-300 sm:px-3 sm:py-2 sm:text-sm">
                              {row.creditObtenu}
                            </td>
                            <td className="px-2 py-2 text-xs sm:px-3 sm:py-2 sm:text-sm">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${avgClass}`}
                              >
                                {hasAvg ? avg : '—'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
