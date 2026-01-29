import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getBacInfo, getBacGrades, getStudentPhoto } from '../services/api';

/**
 * Displays information about the student's baccalaureate as well as the
 * individual subject grades.  The page fetches both the bac details and
 * the list of grades and renders them in a simple table.  A small
 * avatar is fetched separately and displayed next to the student's
 * name when available.
 */
export default function BacInfoPage() {
  const { user } = useAuth();
  const {
    data: bacInfo,
    error: infoError,
    isLoading: infoLoading,
  } = useQuery(
    ['bacInfo', user?.uuid],
    () => getBacInfo(user.uuid, user.token),
    { enabled: !!user }
  );

  const {
    data: bacGrades,
    error: gradesError,
    isLoading: gradesLoading,
  } = useQuery(
    ['bacGrades', user?.uuid],
    () => getBacGrades(user.uuid, user.token),
    { enabled: !!user }
  );

  const {
    data: photoData,
  } = useQuery(
    ['studentPhoto', user?.uuid],
    () => getStudentPhoto(user.uuid, user.token),
    { enabled: !!user }
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Bac Information</h2>
      {(infoLoading || gradesLoading) && <p>Loading…</p>}
      {(infoError || gradesError) && (
        <p className="text-red-600">
          {infoError?.message || gradesError?.message}
        </p>
      )}
      {bacInfo && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-2">
          <div className="flex items-center space-x-4">
            {photoData && (
              // The backend returns a base64 encoded JPEG.  Wrap it in a
              // data URI so it can be displayed directly in the browser.
              <img
                src={`data:image/jpeg;base64,${photoData}`}
                alt="Student photo"
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold">
                {bacInfo.prenomFr} {bacInfo.nomFr}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Matricule: {bacInfo.matricule}
              </p>
            </div>
          </div>
          <p>
            <span className="font-medium">Year:</span> {bacInfo.anneeBac}
          </p>
          <p>
            <span className="font-medium">Series:</span> {bacInfo.libelleSerieBac || bacInfo.refCodeSerieBac}
          </p>
          <p>
            <span className="font-medium">Grade:</span> {bacInfo.moyenneBac}
          </p>
        </div>
      )}
      {Array.isArray(bacGrades) && bacGrades.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Subject</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {bacGrades.map((g, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700">
                  <td className="px-4 py-2 whitespace-nowrap">{g.refCodeMatiereLibelleFr}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{g.note ?? '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}