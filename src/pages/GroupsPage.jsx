import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getStudentCards, getGroups } from '../services/api';

export default function GroupsPage() {
  const { user } = useAuth();

  const {
    data,
    error,
    isLoading,
  } = useQuery(
    ['groups-latest', user?.uuid],
    async () => {
      const cards = await getStudentCards(user.uuid, user.token);

      if (!Array.isArray(cards) || cards.length === 0) {
        return { groups: [], card: null };
      }

      const latestCard = [...cards].sort((a, b) => b.id - a.id)[0];
      const groups = await getGroups(latestCard.id, user.token);

      return {
        groups: Array.isArray(groups) ? groups : [],
        card: latestCard,
      };
    },
    { enabled: !!user }
  );

  const groups = data?.groups || [];
  const card = data?.card || null;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-sky-400 to-emerald-400 text-xl shadow-[0_0_25px_rgba(56,189,248,0.65)]">
            <span className="drop-shadow-sm">👥</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Enrolment overview
            </p>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Pedagogical Groups
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Latest groups attached to your most recent academic enrolment.
            </p>
          </div>
        </div>

        {groups.length > 0 && (
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-semibold text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
              {groups.length}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Groups found
            </span>
          </div>
        )}
      </div>

      {/* Enrolment summary card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50/95 via-white/95 to-slate-50/40 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:from-slate-950/95 dark:via-slate-900/90 dark:to-slate-950/90">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Latest enrolment
            </p>
            {card ? (
              <div className="mt-1 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    Academic year
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {card.anneeAcademiqueCode || card.academicYearString}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-[11px]">
                  {card.filiereLibelle && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {card.filiereLibelle}
                    </span>
                  )}
                  {card.niveauLibelle && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                      {card.niveauLibelle}
                    </span>
                  )}
                  {card.cycleLibelle && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                      {card.cycleLibelle}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                No enrolment data found. Groups are loaded based on your most recent Progres card.
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 text-right">
            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
              Synced from Progres
            </span>
            {card?.dateInscription && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Last update:{' '}
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {card.dateInscription}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          <div className="h-3 w-40 animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="grid gap-3 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80"
              >
                <div className="mb-2 h-4 w-44 animate-pulse rounded bg-slate-200/80 dark:bg-slate-800/80" />
                <div className="mb-1 h-3 w-32 animate-pulse rounded bg-slate-200/80 dark:bg-slate-800/80" />
                <div className="mt-3 h-3 w-24 animate-pulse rounded bg-slate-200/80 dark:bg-slate-800/80" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/95 px-4 py-3 text-sm text-red-800 shadow-sm dark:border-red-900/70 dark:bg-red-950/70 dark:text-red-100">
          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-red-500/10 text-base">
            ⚠️
          </div>
          <div>
            <p className="font-semibold">Failed to load groups</p>
            <p className="mt-0.5 text-xs opacity-90">
              {error.message || 'An unexpected error occurred while fetching your groups.'}
            </p>
          </div>
        </div>
      )}

      {/* Groups list / empty state */}
      {!isLoading && !error && (
        <>
          {groups.length > 0 ? (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Groups
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Attached to latest enrolment
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {groups.map((g) => (
                  <article
                    key={g.id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-blue-400/70 hover:shadow-md hover:shadow-blue-500/10 dark:border-slate-800 dark:bg-slate-900/90"
                  >
                    {/* Accent gradient bar */}
                    <span className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 via-sky-400 to-emerald-400 opacity-80" />

                    <div className="pl-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                            {g.nomGroupePedagogique || 'Unnamed group'}
                          </h3>
                          {g.nomSection && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Section:{' '}
                              <span className="font-medium text-slate-700 dark:text-slate-200">
                                {g.nomSection}
                              </span>
                            </p>
                          )}
                          {g.codeGroupePedagogique && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              Group code:{' '}
                              <span className="font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-100">
                                {g.codeGroupePedagogique}
                              </span>
                            </p>
                          )}
                        </div>

                        {g.periodeLibelleLongLt && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {g.periodeLibelleLongLt}
                          </span>
                        )}
                      </div>

                      {/* Optional meta row */}
                      {(g.libelleAnnuel || g.typeGroupeLibelle) && (
                        <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                          {g.libelleAnnuel && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
                              {g.libelleAnnuel}
                            </span>
                          )}
                          {g.typeGroupeLibelle && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
                              {g.typeGroupeLibelle}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/80 bg-slate-50/90 px-6 py-10 text-center text-slate-500 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-400">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200/80 text-2xl dark:bg-slate-800/80">
                👥
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                No groups found for your latest enrolment
              </p>
              <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
                We couldn&apos;t find any pedagogical groups linked to your current academic
                year. If you believe this is an error, please verify your information on
                Progres or contact your faculty administration.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
