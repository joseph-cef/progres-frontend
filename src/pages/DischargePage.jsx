import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getDischarge } from '../services/api';

/**
 * Displays the student's discharge statuses from various university
 * departments such as the central library, faculty, scholarship service,
 * department and residence.  A discharged state is represented by a
 * truthy value in the DTO; the page converts this into a human
 * friendly yes/no indicator.
 */
export default function DischargePage() {
  const { user } = useAuth();
  const {
    data,
    error,
    isLoading,
  } = useQuery(
    ['discharge', user?.uuid],
    () => getDischarge(user.uuid),
    { enabled: !!user }
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Discharge</h2>
      {isLoading && <p>Loading discharge state…</p>}
      {error && <p className="text-red-600">Failed to load discharge state: {error.message}</p>}
      {data ? (
        <div className="space-y-2 p-4 bg-white dark:bg-gray-800 rounded shadow">
          <DischargeRow label="Central Library" value={data.centralLibraryLevel} />
          <DischargeRow label="Faculty" value={data.facultyLevel} />
          <DischargeRow label="Scholarship Service" value={data.scholarshipServiceLevel} />
          <DischargeRow label="Department" value={data.departmentLevel} />
          <DischargeRow label="Residence" value={data.residenceLevel} />
        </div>
      ) : (
        !isLoading && <p>No discharge data found.</p>
      )}
    </div>
  );
}

function DischargeRow({ label, value }) {
  const isCleared = !!value;
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{isCleared ? 'Cleared' : 'Not cleared'}</span>
    </div>
  );
}