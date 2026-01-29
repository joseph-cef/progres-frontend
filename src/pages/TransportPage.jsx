import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getStudentCards, getTransportState } from '../services/api';

/**
 * Displays the student's transport payment status.  A simple boolean
 * indicator informs whether the student has paid for university
 * transportation for the current academic year.  If no data is found
 * the backend returns null and the page reflects that.
 */
export default function TransportPage() {
  const { user } = useAuth();
  const { data, error, isLoading } = useQuery(
    ['transport', user?.uuid],
    async () => {
      const cards = await getStudentCards(user.uuid, user.token);
      if (!cards.length) return null;
      const latest = [...cards].sort((a, b) => b.id - a.id)[0];
      return await getTransportState(user.uuid, latest.id, user.token);
    },
    { enabled: !!user }
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Transport</h2>
      {isLoading && <p>Loading transport status…</p>}
      {error && <p className="text-red-600">Failed to load transport status: {error.message}</p>}
      {data ? (
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <p>
            <span className="font-medium">Transport Paid:</span> {data.transportPayed ? 'Yes' : 'No'}
          </p>
        </div>
      ) : (
        !isLoading && <p>No transport data found.</p>
      )}
    </div>
  );
}
