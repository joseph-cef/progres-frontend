import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getStudentCards, getGroups } from '../services/api';

/**
 * Shows the pedagogical groups and sections for each of the student's
 * enrolments.  Groups are fetched for every card the student has.  Each
 * group entry displays the group name, section name (if available) and
 * the long label of the academic period it belongs to.
 */
export default function GroupsPage() {
  const { user } = useAuth();
  const {
    data,
    error,
    isLoading,
  } = useQuery(
    ['groups', user?.uuid],
    async () => {
      const cards = await getStudentCards(user.uuid, user.token);
      const groupsPerCard = await Promise.all(
        cards.map((card) => getGroups(card.id, user.token))
      );
      return groupsPerCard.flat();
    },
    { enabled: !!user }
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Groups</h2>
      {isLoading && <p>Loading groups…</p>}
      {error && (
        <p className="text-red-600">Failed to load groups: {error.message}</p>
      )}
      {Array.isArray(data) && data.length > 0 ? (
        <ul className="space-y-2">
          {data.map((g) => (
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