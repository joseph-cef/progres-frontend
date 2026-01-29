import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getStudentCards } from '../services/api';

/**
 * Dashboard home page.  Shows a welcome greeting with the
 * student's name if available, a highlight of their latest
 * enrollment details, and quick links to commonly used pages.
 */
export default function HomePage() {
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

  const latestCard = Array.isArray(cards)
    ? [...cards].sort((a, b) => b.id - a.id)[0]
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome
            {latestCard
              ? `, ${latestCard.individuPrenomLatin || latestCard.individualFirstNameLatin} ${
                  latestCard.individuNomLatin || latestCard.individualLastNameLatin
                }`
              : user?.userName
              ? `, ${user.userName}`
              : ''}
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overview of your latest academic information and quick shortcuts.
          </p>
        </div>
        {latestCard && (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
            Academic year: <span className="ml-1 font-semibold">{latestCard.anneeAcademiqueCode || latestCard.academicYearString}</span>
          </span>
        )}
      </div>

      {/* Status / Latest Enrollment */}
      {isLoading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-5">
          <div className="space-y-3">
            <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          Failed to load cards: {error.message}
        </div>
      )}

      {latestCard && !isLoading && !error && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">
                Latest Enrollment
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Current registration details from your student profile.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              Active
            </span>
          </div>

          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="space-y-0.5">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Name
              </dt>
              <dd className="text-gray-900 dark:text-gray-100">
                {latestCard.individuPrenomLatin || latestCard.individualFirstNameLatin}{' '}
                {latestCard.individuNomLatin || latestCard.individualLastNameLatin}
              </dd>
            </div>

            <div className="space-y-0.5">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Registration No.
              </dt>
              <dd className="font-mono text-sm text-gray-900 dark:text-gray-100">
                {latestCard.numeroInscription || latestCard.registrationNumber}
              </dd>
            </div>

            <div className="space-y-0.5">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Level
              </dt>
              <dd className="text-gray-900 dark:text-gray-100">
                {latestCard.niveauLibelleLongLt || latestCard.levelStringLongLatin}
              </dd>
            </div>

            <div className="space-y-0.5">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Card ID
              </dt>
              <dd className="font-mono text-xs text-gray-600 dark:text-gray-300">
                {latestCard.id}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {/* Quick links */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Quick Access
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          <QuickLink to="/cards" label="Student Cards" description="View all cards" />
          <QuickLink to="/groups" label="Groups" description="Your group info" />
          <QuickLink to="/subjects" label="Subjects" description="Registered modules" />
          <QuickLink to="/exam-grades" label="Exam Grades" description="Final exam marks" />
          <QuickLink to="/cc-grades" label="CC Grades" description="Continuous assessment" />
          {/* Additional quick links can be added here */}
        </div>
      </div>
    </div>
  );
}

function QuickLink({ to, label, description }) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/80 dark:hover:border-blue-400"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
          {label}
        </span>
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-[10px] font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
          Go
        </span>
      </div>
      {description && (
        <span className="text-xs text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300">
          {description}
        </span>
      )}
    </Link>
  );
}
