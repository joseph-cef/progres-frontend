import axios from 'axios';

/**
 * A thin wrapper around axios for communicating with the Progres backend.  It
 * centralises the base URL and exposes functions corresponding to each
 * endpoint defined in the original Kotlin implementation.  Where tokens
 * are required, the caller must pass the raw token string returned by
 * `login`.  The backend expects this token as the value of the
 * `Authorization` header without any `Bearer` prefix.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to catch errors and throw a consistent exception.  This can be
// extended to handle token refresh logic if necessary.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error.message || 'Unknown error';
    return Promise.reject(new Error(message));
  },
);

// Helper to build the Authorization header if a token is provided.
function authHeader(token) {
  return token ? { Authorization: token } : {};
}

export async function login(username, password) {
  const { data } = await api.post('/api/authentication/v1/', { username, password });
  return data;
}

export async function getStudentCards(uuid, token) {
  const { data } = await api.get(`/api/infos/bac/${uuid}/dias`, { headers: authHeader(token) });
  return data;
}

export async function getTransportState(uuid, cardId, token) {
  const { data } = await api.get(`/api/infos/demandeTransport/${uuid}/${cardId}`, { headers: authHeader(token) });
  return data;
}

export async function getAccommodation(uuid, token) {
  const { data } = await api.get(`/api/infos/bac/${uuid}/demandesHebregement`, { headers: authHeader(token) });
  return data;
}

export async function getIndividualInfo(uuid, token) {
  const { data } = await api.get(`/api/infos/bac/${uuid}/individu`, { headers: authHeader(token) });
  return data;
}

export async function getExamGrades(cardId, token) {
  const { data } = await api.get(`/api/infos/planningSession/dia/${cardId}/noteExamens`, { headers: authHeader(token) });
  return data;
}

export async function getExamSchedule(offerId, levelId, token) {
  const { data } = await api.get(`/api/infos/Examens/${offerId}/niveau/${levelId}/examens`, { headers: authHeader(token) });
  return data;
}

export async function getGroups(cardId, token) {
  const { data } = await api.get(`/api/infos/dia/${cardId}/groups`, { headers: authHeader(token) });
  return data;
}

export async function getSubjects(offerId, levelId, token) {
  const { data } = await api.get(`/api/infos/offreFormation/${offerId}/niveau/${levelId}/Coefficients`, { headers: authHeader(token) });
  return data;
}

export async function getSubjectSchedule(cardId, token) {
  const { data } = await api.get(`/api/infos/seanceEmploi/inscription/${cardId}`, { headers: authHeader(token) });
  return data;
}

export async function getBacInfo(uuid, token) {
  const { data } = await api.get(`/api/infos/bac/${uuid}`, { headers: authHeader(token) });
  return data;
}

export async function getBacGrades(uuid, token) {
  const { data } = await api.get(`/api/infos/bac/${uuid}/notes`, { headers: authHeader(token) });
  return data;
}

export async function getAcademicTranscripts(uuid, cardId, token) {
  const { data } = await api.get(`/api/infos/bac/${uuid}/dias/${cardId}/periode/bilans`, { headers: authHeader(token) });
  return data;
}

export async function getAcademicDecision(uuid, cardId, token) {
  const { data } = await api.get(`/api/infos/bac/${uuid}/dia/${cardId}/annuel/bilan`, { headers: authHeader(token) });
  return data;
}

export async function getCCGrades(cardId, token) {
  const { data } = await api.get(`/api/infos/controleContinue/dia/${cardId}/notesCC`, { headers: authHeader(token) });
  return data;
}

export async function getCurrentAcademicYear(token) {
  const { data } = await api.get('/api/infos/AnneeAcademicqueEncours', { headers: authHeader(token) });
  return data;
}

export async function getAcademicPeriods(yearId, token) {
  const { data } = await api.get(`/api/infos/niveau/${yearId}/periodes`, { headers: authHeader(token) });
  return data;
}

export async function getDischarge(uuid) {
  // Discharge endpoint uses a different base domain according to the Kotlin
  // implementation.  We call it with the same base URL for simplicity; if
  // required the environment variable can be overridden at build time.
  const { data } = await api.get(`/api/${uuid}/qitus`);
  return data;
}

export async function getDebts(uuid, token) {
  const { data } = await api.get(`/api/infos/dettes/${uuid}`, { headers: authHeader(token) });
  return data;
}

export async function getStudentPhoto(uuid, token) {
  const { data } = await api.get(`/api/infos/image/${uuid}`, { headers: { ...authHeader(token), Accept: 'image/jpeg' } });
  return data;
}

export async function getEstablishmentLogo(establishmentId, token) {
  const { data } = await api.get(`/api/infos/logoEtablissement/${establishmentId}`, { headers: { ...authHeader(token), Accept: 'image/jpeg' } });
  return data;
}