import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getAccommodation } from '../services/api';
 
export default function AccommodationPage() {
  const { user } = useAuth();
  const {
    data,
    error,
    isLoading,
  } = useQuery(
    ['accommodation', user?.uuid],
    () => getAccommodation(user.uuid, user.token),
    { enabled: !!user }
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Accommodation</h2>
      {isLoading && <p>Loading accommodation…</p>}
      {error && <p className="text-red-600">Failed to load accommodation: {error.message}</p>}
      {Array.isArray(data) && data.length > 0 ? (
        <ul className="space-y-2">
          {data.map((item, idx) => (
            <li
              key={idx}
              className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-1"
            >
              <p className="font-medium">Residence: {item.llResidanceLatin}</p>
              <p>Dormitory: {item.llDouLatin}</p>
              {item.llAffectation && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Affectation: {item.llAffectation}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <p>No accommodation data found.</p>
      )}
    </div>
  );
}
