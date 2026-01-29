import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getIndividualInfo, getStudentPhoto, getEstablishmentLogo, getStudentCards } from '../services/api';

/**
 * Displays personal details about the student along with their latest
 * registration number.  Fetches the individual's info, an optional
 * photo, the establishment logo, and the latest card for the
 * registration number.  Handles loading and error states.
 */
export default function ProfilePage() {
  const { user } = useAuth();
  // Individual info
  const {
    data: info,
    error: infoError,
    isLoading: infoLoading,
  } = useQuery(
    ['individualInfo', user?.uuid],
    () => getIndividualInfo(user.uuid, user.token),
    { enabled: !!user }
  );
  // Student photo
  const { data: photoData } = useQuery(
    ['studentPhoto', user?.uuid],
    () => getStudentPhoto(user.uuid, user.token),
    { enabled: !!user }
  );
  // Establishment logo (only fetched if establishment ID is present)
  const { data: logoData } = useQuery(
    ['establishmentLogo', user?.establishmentId],
    () => getEstablishmentLogo(user.establishmentId, user.token),
    { enabled: !!user && !!user.establishmentId }
  );
  // Student cards to get the latest academic year
  const { data: cards } = useQuery(
    ['cards', user?.uuid],
    () => getStudentCards(user.uuid, user.token),
    { enabled: !!user }
  );

  const latestCard = Array.isArray(cards) ? [...cards].sort((a, b) => b.id - a.id)[0] : null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Profile</h2>
      {infoLoading && <p>Loading profile…</p>}
      {infoError && <p className="text-red-600">Failed to load profile: {infoError.message}</p>}
      {info && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-3">
          <div className="flex items-center space-x-4">
            {/* Uncomment the photo display once backend returns proper image data */}
            {/* {photoData && (
              <img
                src={`data:image/jpeg;base64,${photoData}`}
                alt="Student photo"
                className="w-20 h-20 rounded-full object-cover"
              />
            )} */}
            <div>
              <h3 className="text-lg font-semibold">
                {info.prenomLatin} {info.nomLatin}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Born on {info.dateNaissance} in {info.lieuNaissance || '—'}
              </p>
              {latestCard && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Registration: {latestCard.numeroInscription || latestCard.registrationNumber}
                </p>
              )}
            </div>
          </div>
          {logoData && (
            <div className="mt-4">
              <img
                src={`data:image/jpeg;base64,${logoData}`}
                alt="Establishment logo"
                className="h-16"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
