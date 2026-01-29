import axios from 'axios';

// إذا لم يتم تحديد VITE_API_BASE_URL في .env نستعمل '/api' كقيمة افتراضية
// حتى نمر دائماً عبر الـ proxy في Vite أثناء التطوير.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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

/**
 * Authentication
 * Kotlin: Endpoints.Login("/api/authentication/v1/")
 * هنا نستعمل المسار بدون 'api/' لأن baseURL هو '/api'
 */
export async function login(username, password) {
  const { data } = await api.post('/authentication/v1/', { username, password });
  return data;
}

/**
 * Student cards (DIAs)
 * Kotlin: "/api/infos/bac/{uuid}/dias"
 */
export async function getStudentCards(uuid, token) {
  const { data } = await api.get(`/infos/bac/${uuid}/dias`, {
    headers: authHeader(token),
  });
  return data;
}

/**
 * Transport state
 * Kotlin: "/api/infos/demandeTransport/{uuid}/{cardId}"
 */
export async function getTransportState(uuid, cardId, token) {
  const { data } = await api.get(`/infos/demandeTransport/${uuid}/${cardId}`, {
    headers: authHeader(token),
  });
  return data;
}

/**
 * Accommodation (hébergement)
 * Kotlin: "/api/infos/bac/{uuid}/demandesHebregement"
 */
export async function getAccommodation(uuid, token) {
  const { data } = await api.get(`/infos/bac/${uuid}/demandesHebregement`, {
    headers: authHeader(token),
  });
  return data;
}

/**
 * Individual info
 * Kotlin: "/api/infos/bac/{uuid}/individu"
 */
export async function getIndividualInfo(uuid, token) {
  const { data } = await api.get(`/infos/bac/${uuid}/individu`, {
    headers: authHeader(token),
  });
  return data;
}

/**
 * Exam grades
 * Kotlin: "/api/infos/planningSession/dia/{cardId}/noteExamens"
 */
export async function getExamGrades(cardId, token) {
  const { data } = await api.get(
    `/infos/planningSession/dia/${cardId}/noteExamens`,
    { headers: authHeader(token) },
  );
  return data;
}

/**
 * Exam schedule
 * Kotlin: "/api/infos/Examens/{offerId}/niveau/{levelId}/examens"
 */
export async function getExamSchedule(offerId, levelId, token) {
  const { data } = await api.get(
    `/infos/Examens/${offerId}/niveau/${levelId}/examens`,
    { headers: authHeader(token) },
  );
  return data;
}

/**
 * Groups (sections, TD/TP groups)
 * Kotlin: "/api/infos/dia/{cardId}/groups"
 */
export async function getGroups(cardId, token) {
  const { data } = await api.get(`/infos/dia/${cardId}/groups`, {
    headers: authHeader(token),
  });
  return data;
}

/**
 * Subjects & coefficients
 * Kotlin: "/api/infos/offreFormation/{offerId}/niveau/{levelId}/Coefficients"
 */
export async function getSubjects(offerId, levelId, token) {
  const { data } = await api.get(
    `/infos/offreFormation/${offerId}/niveau/${levelId}/Coefficients`,
    { headers: authHeader(token) },
  );
  return data;
}

/**
 * Subject schedule (emploi du temps)
 * Kotlin: "/api/infos/seanceEmploi/inscription/{cardId}"
 */
export async function getSubjectSchedule(cardId, token) {
  const { data } = await api.get(
    `/infos/seanceEmploi/inscription/${cardId}`,
    { headers: authHeader(token) },
  );
  return data;
}

/**
 * Baccalaureate info
 * Kotlin: "/api/infos/bac/{uuid}"
 */
export async function getBacInfo(uuid, token) {
  const { data } = await api.get(`/infos/bac/${uuid}`, {
    headers: authHeader(token),
  });
  return data;
}

/**
 * Baccalaureate subject grades
 * Kotlin: "/api/infos/bac/{uuid}/notes"
 */
export async function getBacGrades(uuid, token) {
  const { data } = await api.get(`/infos/bac/${uuid}/notes`, {
    headers: authHeader(token),
  });
  return data;
}

/**
 * Academic transcripts (bilans)
 * Kotlin: "/api/infos/bac/{uuid}/dias/{cardId}/periode/bilans"
 */
export async function getAcademicTranscripts(uuid, cardId, token) {
  const { data } = await api.get(
    `/infos/bac/${uuid}/dias/${cardId}/periode/bilans`,
    { headers: authHeader(token) },
  );
  return data;
}

/**
 * Academic decision (annual bilan)
 * Kotlin: "/api/infos/bac/{uuid}/dia/{cardId}/annuel/bilan"
 */
export async function getAcademicDecision(uuid, cardId, token) {
  const { data } = await api.get(
    `/infos/bac/${uuid}/dia/${cardId}/annuel/bilan`,
    { headers: authHeader(token) },
  );
  return data;
}

/**
 * Continuous assessment grades (CC)
 * Kotlin: "/api/infos/controleContinue/dia/{cardId}/notesCC"
 */
export async function getCCGrades(cardId, token) {
  const { data } = await api.get(
    `/infos/controleContinue/dia/${cardId}/notesCC`,
    { headers: authHeader(token) },
  );
  return data;
}

/**
 * Current academic year
 * Kotlin: "/api/infos/AnneeAcademicqueEncours"
 */
export async function getCurrentAcademicYear(token) {
  const { data } = await api.get('/infos/AnneeAcademicqueEncours', {
    headers: authHeader(token),
  });
  return data;
}

/**
 * Academic periods
 * Kotlin: "/api/infos/niveau/{yearId}/periodes"
 */
export async function getAcademicPeriods(yearId, token) {
  const { data } = await api.get(`/infos/niveau/${yearId}/periodes`, {
    headers: authHeader(token),
  });
  return data;
}

/**
 * Discharge (Quitus)
 * Kotlin: GetDischarges("/api/{uuid}/qitus", QUITTANCE_URL)
 *
 * هنا في النسخة الأصلية يستعمل دومين مختلف: https://quittance.mesrs.dz
 * لو أردت أن تعمل عبر proxy أيضاً يمكنك ضبط VITE_QUITTANCE_BASE_URL
 * و proxy آخر في Vite. حالياً نستعمل نفس الـ api base URL مع نفس المسار.
 */
export async function getDischarge(uuid, token) {
  const { data } = await api.get(`/${uuid}/qitus`, {
    headers: authHeader(token),
  });
  return data;
}

/**
 * Debts
 * Kotlin: "/api/infos/dettes/{uuid}"
 */
export async function getDebts(uuid, token) {
  const { data } = await api.get(`/infos/dettes/${uuid}`, {
    headers: authHeader(token),
  });
  return data;
}

/**
 * Student photo
 * Kotlin: "/api/infos/image/{uuid}"
 */
export async function getStudentPhoto(uuid, token) {
  const { data } = await api.get(`/infos/image/${uuid}`, {
    headers: {
      ...authHeader(token),
      Accept: 'image/jpeg',
    },
    responseType: 'arraybuffer',
  });
  return data;
}

/**
 * Establishment logo
 * Kotlin: "/api/infos/logoEtablissement/{establishmentId}"
 */
export async function getEstablishmentLogo(establishmentId, token) {
  const { data } = await api.get(
    `/infos/logoEtablissement/${establishmentId}`,
    {
      headers: {
        ...authHeader(token),
        Accept: 'image/jpeg',
      },
      responseType: 'arraybuffer',
    },
  );
  return data;
}
