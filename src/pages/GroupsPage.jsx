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
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Groups (Latest Enrolment)</h2>

      {card && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Academic Year:{' '}
          <span className="font-medium">
            {card.anneeAcademiqueCode || card.academicYearString}
          </span>
        </p>
      )}

      {isLoading && <p>Loading groups…</p>}

      {error && (
        <p className="text-red-600">Failed to load groups: {error.message}</p>
      )}

      {groups.length > 0 ? (
        <ul className="space-y-2">
          {groups.map((g) => (
            <li
              key={g.id}
              className="p-3 bg-white dark:bg-gray-800 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{g.nomGroupePedagogique}</p>
                {g.nomSection && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Section: {g.nomSection}
                  </p>
                )}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {g.periodeLibelleLongLt}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <p>No groups found.</p>
      )}
    </div>
  );
}
