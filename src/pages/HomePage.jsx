import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getStudentCards } from '../services/api';

/**
 * Home page shown after login.  It fetches the authenticated student's
 * cards and displays a summary of the most recent card.  The page also
 * provides quick access links to the various modules available in the
 * Progres system.  If multiple cards exist (representing different
 * academic years) the newest is displayed first.
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

  // Derive the most recent card by sorting descending on the id.  If
  // multiple cards exist this typically corresponds to the latest year.
  const latestCard = Array.isArray(cards)
    ? [...cards].sort((a, b) => b.id - a.id)[0]
    : null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Welcome {user?.userName}</h2>
      {isLoading && <p>Loading your information…</p>}
      {error && (
        <p className="text-red-600">Failed to load cards: {error.message}</p>
      )}
      {latestCard && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Latest Enrollment</h3>
          <p>
            <span className="font-medium">Academic Year:</span>{' '}
            {latestCard.anneeAcademiqueCode || latestCard.academicYearString}
          </p>
          <p>
            <span className="font-medium">Name:</span> {latestCard.individuPrenomLatin || latestCard.individualFirstNameLatin}{' '}
            {latestCard.individuNomLatin || latestCard.individualLastNameLatin}
          </p>
          <p>
            <span className="font-medium">Registration No.:</span>{' '}
            {latestCard.numeroInscription || latestCard.registrationNumber}
          </p>
          <p>
            <span className="font-medium">Level:</span>{' '}
            {latestCard.niveauLibelleLongLt || latestCard.levelStringLongLatin}
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <QuickLink to="/cards" label="Student Cards" />
        <QuickLink to="/bac-info" label="Bac Info" />
        <QuickLink to="/groups" label="Groups" />
        <QuickLink to="/subjects" label="Subjects" />
        <QuickLink to="/schedule" label="Schedule" />
        <QuickLink to="/exam-grades" label="Exam Grades" />
        <QuickLink to="/exam-schedule" label="Exam Schedule" />
        <QuickLink to="/cc-grades" label="CC Grades" />
        <QuickLink to="/transcripts" label="Transcripts" />
        <QuickLink to="/accommodation" label="Accommodation" />
        <QuickLink to="/transport" label="Transport" />
        <QuickLink to="/discharge" label="Discharge" />
        <QuickLink to="/profile" label="Profile" />
      </div>
    </div>
  );
}

function QuickLink({ to, label }) {
  return (
    <Link
      to={to}
      className="block p-4 text-center bg-white dark:bg-gray-800 rounded shadow hover:bg-blue-500 hover:text-white transition-colors"
    >
      {label}
    </Link>
  );
}