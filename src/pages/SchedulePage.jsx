import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getStudentCards, getSubjectSchedule } from '../services/api';

function formatTimeRange(item) {
  const lib = item.plageHoraireLibelleFr;
  if (typeof lib === 'string' && lib.trim()) {
    return lib.replace('-', '–');
  }
  const start = (item.plageHoraireHeureDebut || '').slice(0, 5);
  const end = (item.plageHoraireHeureFin || '').slice(0, 5);
  if (!start || !end) return '—';
  return `${start}–${end}`;
}

function getSlotKey(item) {
  return (
    item.plageHoraireLibelleFr ||
    `${item.plageHoraireHeureDebut}-${item.plageHoraireHeureFin}`
  );
}

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 7];
const DAY_LABELS_SHORT = {
  1: 'SUN',
  2: 'MON',
  3: 'TUE',
  4: 'WED',
  5: 'THU',
  6: 'FRI',
  7: 'SAT',
};

export default function SchedulePage() {
  const { user } = useAuth();

  const { data, error, isLoading } = useQuery(
    ['schedule', user?.uuid],
    async () => {
      const cards = await getStudentCards(user.uuid, user.token);
      if (!cards.length) return [];
      const latest = [...cards].sort((a, b) => b.id - a.id)[0];
      return await getSubjectSchedule(latest.id, user.token);
    },
    { enabled: !!user }
  );

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

  const hasData = sorted.length > 0;

  const availableDayIds = Array.from(new Set(sorted.map((s) => s.jourId))).sort(
    (a, b) => a - b
  );
  const dayColumns = DAY_ORDER.filter((id) => availableDayIds.includes(id));

  const slotMap = new Map();
  sorted.forEach((item) => {
    const key = getSlotKey(item);
    if (!slotMap.has(key)) {
      slotMap.set(key, {
        key,
        label: formatTimeRange(item),
        start: item.plageHoraireHeureDebut || '',
      });
    }
  });
  const slots = Array.from(slotMap.values()).sort((a, b) =>
    a.start.localeCompare(b.start)
  );

  const cells = new Map();
  sorted.forEach((item) => {
    const slotKey = getSlotKey(item);
    const dayId = item.jourId ?? 0;
    const key = `${slotKey}-${dayId}`;
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key).push(item);
  });

  const first = sorted[0];
  const groupLabel = first?.groupe || '';

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-sky-200 bg-sky-50 px-4 py-4 text-center shadow-sm dark:border-sky-800/70 dark:bg-sky-950/40">
        <h2 className="text-lg font-extrabold tracking-[0.18em] text-sky-800 dark:text-sky-100 sm:text-xl">
          WEEKLY TIMETABLE
        </h2>
        <p className="mt-1 text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-200">
          {groupLabel || 'Computer Science – Current Semester'}
        </p>
      </div>

      {isLoading && (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-200/60 to-transparent dark:via-slate-700/40" />
          <style>{`
            @keyframes shimmer {
              100% {
                transform: translateX(100%);
              }
            }
          `}</style>
          <div className="relative space-y-4">
            <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-8 w-full rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-28 w-full rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
          Failed to load schedule: {error.message}
        </div>
      )}

      {!isLoading && !error && !hasData && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-200 text-lg dark:bg-slate-800">
            🗓️
          </div>
          <p>No schedule found.</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Once the timetable is available in PROGRES, it will appear here automatically.
          </p>
        </div>
      )}

      {!isLoading && !error && hasData && (
        <div className="overflow-x-auto rounded-3xl border border-slate-300 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-950">
          <table className="min-w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr>
                <th className="bg-sky-700 px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-white sm:text-xs">
                  TIME
                </th>
                {dayColumns.map((dayId) => (
                  <th
                    key={dayId}
                    className="bg-sky-700 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-white sm:text-xs"
                  >
                    {DAY_LABELS_SHORT[dayId] || 'DAY'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot.key} className="border-t border-slate-300 dark:border-slate-800">
                  <td className="bg-sky-50 px-3 py-2 text-[11px] font-semibold text-sky-900 dark:bg-slate-900 dark:text-sky-100 sm:px-4 sm:text-xs">
                    {slot.label}
                  </td>
                  {dayColumns.map((dayId) => {
                    const key = `${slot.key}-${dayId}`;
                    const sessions = cells.get(key) || [];

                    if (!sessions.length) {
                      return (
                        <td
                          key={dayId}
                          className="h-12 px-2 py-2 text-center text-[11px] text-slate-400 dark:text-slate-500 sm:px-3"
                        />
                      );
                    }

                    return (
                      <td
                        key={dayId}
                        className="px-2 py-2 text-center align-top text-[11px] sm:px-3"
                      >
                        <div className="flex flex-col items-center justify-center gap-1">
                          {sessions.map((s, idx) => {
                            const teacher = `${s.prenomEnseignantLatin || ''} ${
                              s.nomEnseignantLatin || ''
                            }`.trim();
                            const type = s.ap || '';
                            const room = s.refLieuDesignation || '';

                            const typeColor =
                              type === 'CM'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
                                : type === 'TD'
                                ? 'bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200'
                                : type === 'TP'
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200';

                            return (
                              <div
                                key={idx}
                                className="flex flex-col items-center gap-0.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                              >
                                <div className="font-semibold leading-snug line-clamp-2">
                                  {s.matiere}
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-1">
                                  {type && (
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${typeColor}`}
                                    >
                                      {type}
                                    </span>
                                  )}
                                  {room && (
                                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                      {room}
                                    </span>
                                  )}
                                </div>
                                {teacher && (
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                    {teacher}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
