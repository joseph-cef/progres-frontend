import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getStudentCards } from '../services/api';

/**
 * Displays all student cards associated with the authenticated user.  Each
 * card represents an academic year and contains information such as the
 * registration number, cycle, level and field of study.  Cards are
 * rendered in descending order of ID (most recent first).
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

  const sortedCards = Array.isArray(cards)
    ? [...cards].sort((a, b) => b.id - a.id)
    : [];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Student Cards</h2>
      {isLoading && <p>Loading cards…</p>}
      {error && <p className="text-red-600">Failed to load cards: {error.message}</p>}
      {sortedCards.map((card) => (
        <div key={card.id} className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-1">
          <h3 className="text-lg font-semibold">
            Academic Year: {card.anneeAcademiqueCode || card.academicYearString}
          </h3>
          <p>
            <span className="font-medium">Name:</span> {card.individuPrenomLatin || card.individualFirstNameLatin}{' '}
            {card.individuNomLatin || card.individualLastNameLatin}
          </p>
          <p>
            <span className="font-medium">Registration No.:</span> {card.numeroInscription || card.registrationNumber}
          </p>
          <p>
            <span className="font-medium">Cycle:</span> {card.refLibelleCycle || card.cycleStringLatin}
          </p>
          <p>
            <span className="font-medium">Level:</span> {card.niveauLibelleLongLt || card.levelStringLongLatin}
          </p>
          {card.ofLlFiliere && (
            <p>
              <span className="font-medium">Field:</span> {card.ofLlFiliere}
            </p>
          )}
          {card.ofLlSpecialite && (
            <p>
              <span className="font-medium">Specialty:</span> {card.ofLlSpecialite}
            </p>
          )}
        </div>
      ))}
      {sortedCards.length === 0 && !isLoading && (
        <p>No cards found.</p>
      )}
    </div>
  );
}