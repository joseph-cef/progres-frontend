import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getStudentCards } from '../services/api';

/**
 * Displays the student's latest enrollment card with a
 * beautifully styled summary of registration details, and basic
 * personal information.  Handles loading, error and empty states.
 */
export default function CardsPage() {
  const { user } = useAuth();

  const {
    data: cards,
    error,
    isLoading,
  } = useQuery(
    ['cards', user?.uuid],
    () => getStudentCards(user.uuid, user.token),
    { enabled: !!user }
  );

  const latestCard =
    Array.isArray(cards) && cards.length > 0
      ? [...cards].sort((a, b) => b.id - a.id)[0]
      : null;

  const firstName =
    latestCard?.individuPrenomLatin || latestCard?.individualFirstNameLatin || '';
  const lastName =
    latestCard?.individuNomLatin || latestCard?.individualLastNameLatin || '';
  const fullName = `${firstName} ${lastName}`.trim();

  const initials = fullName
    ? fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
    : user?.userName?.[0]?.toUpperCase() || '?';

  const academicYear =
    latestCard?.anneeAcademiqueCode || latestCard?.academicYearString || '—';

  const registrationNumber =
    latestCard?.numeroInscription || latestCard?.registrationNumber || '—';

  const level =
    latestCard?.niveauLibelleLongLt || latestCard?.levelStringLongLatin || '—';

  const cycle = latestCard?.refLibelleCycle || latestCard?.cycleStringLatin || '—';

  const field = latestCard?.ofLlFiliere || null;
  const specialty = latestCard?.ofLlSpecialite || null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Student Card
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Latest enrollment details for your current academic year.
          </p>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-200/40 to-transparent dark:via-gray-700/40" />
          <style>{`
            @keyframes shimmer {
              100% {
                transform: translateX(100%);
              }
            }
          `}</style>
          <div className="relative z-10 flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-56 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-3 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          Failed to load card: {error.message}
        </div>
      )}

      {/* No card */}
      {!isLoading && !error && !latestCard && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
          No student card found for your account.
        </div>
      )}

      {/* Main fancy card */}
      {latestCard && !isLoading && !error && (
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-emerald-500/90 p-1 shadow-xl dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
          {/* Glow effect */}
          <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-6 rounded-[1.35rem] bg-slate-950/80 px-5 py-5 text-slate-50 sm:px-7 sm:py-6 lg:flex-row lg:items-stretch">
            {/* Left side: avatar + main info */}
            <div className="flex flex-1 flex-col gap-4 lg:border-r lg:border-white/10 lg:pr-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900/80 text-xl font-semibold tracking-wide">
                  {initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                      Student
                    </span>
                    <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-blue-100">
                      Active
                    </span>
                  </div>
                  <h3 className="mt-1 text-xl font-semibold leading-tight sm:text-2xl">
                    {fullName || user?.userName || 'Student Name'}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-300/80">
                    Registration No.&nbsp;
                    <span className="font-mono text-[11px] font-medium">
                      {registrationNumber}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                <InfoPill label="Academic Year" value={academicYear} />
                <InfoPill label="Level" value={level} />
                <InfoPill label="Cycle" value={cycle} />
                {field && <InfoPill label="Field" value={field} />} 
                {specialty && <InfoPill label="Specialty" value={specialty} />} 
                <InfoPill label="Card ID" value={latestCard.id} />
              </div>
            </div>

            {/* Right side: decorative / summary */}
            <div className="flex w-full flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 lg:w-64">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                  Enrollment Snapshot
                </p>
                <p className="mt-1 text-sm text-slate-100">
                  This card represents your latest registration in the university system.
                </p>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Year</span>
                  <span className="font-medium">{academicYear}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Level</span>
                  <span className="font-medium line-clamp-1 text-right">{level}</span>
                </div>
                {field && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Field</span>
                    <span className="max-w-[9rem] text-right font-medium line-clamp-1">{field}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Generated from official records</span>
                <span className="font-mono uppercase tracking-[0.16em]">ID • {String(latestCard.id).slice(-6)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="text-xs font-medium text-slate-50 line-clamp-2">
        {value || '—'}
      </p>
    </div>
  );
}
