import axios from 'axios';

// =========================
// API BASE URL CONFIG
// =========================

// ⚠️ غيّر هذا الرابط إذا كان الـ API عندك على دومين أو مسار مختلف.
const DEFAULT_API_BASE_URL = 'https://progres.univ-dz.dz/api';

// نأخذ من متغيّر البيئة إن وُجد، وإلا نستعمل القيمة الافتراضية.
// نزيل أي / زيادة في نهاية الرابط لنتجنب // في المسارات.
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  DEFAULT_API_BASE_URL
).replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
});

// =========================
// GLOBAL ERROR HANDLING
// =========================

// Normalize error responses to return a single message string.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error.message ||
      'Unknown error';
    return Promise.reject(new Error(message));
  },
);

function authHeader(token) {
  return token ? { Authorization: token } : {};
}

// =========================
// API METHODS
// =========================

export async function login(username, password) {
  // baseURL + /authentication/v1/
  // مثال: https://progres.univ-dz.dz/api/authentication/v1/
  const { data } = await api.post('/authentication/v1/', { username, password });
  return data;
}

export async function getStudentCards(uuid, token) {
  const { data } = await api.get(`/infos/bac/${uuid}/dias`, {
    headers: authHeader(token),
  });
  return data;
}

export async function getTransportState(uuid, cardId, token) {
  const { data } = await api.get(`/infos/demandeTransport/${uuid}/${cardId}`, {
    headers: authHeader(token),
  });
  return data;
}

export async function getAccommodation(uuid, token) {
  const { data } = await api.get(`/infos/bac/${uuid}/demandesHebregement`, {
    headers: authHeader(token),
  });
  return data;
}

export async function getIndividualInfo(uuid, token) {
  const { data } = await api.get(`/infos/bac/${uuid}/individu`, {
    headers: authHeader(token),
  });
  return data;
}

export async function getExamGrades(cardId, token) {
  const { data } = await api.get(
    `/infos/planningSession/dia/${cardId}/noteExamens`,
    { headers: authHeader(token) },
  );
  return data;
}

export async function getExamSchedule(offerId, levelId, token) {
  const { data } = await api.get(
    `/infos/Examens/${offerId}/niveau/${levelId}/examens`,
    { headers: authHeader(token) },
  );
  return data;
}

export async function getGroups(cardId, token) {
  const { data } = await api.get(`/infos/dia/${cardId}/groups`, {
    headers: authHeader(token),
  });
  return data;
}

export async function getSubjects(offerId, levelId, token) {
  const { data } = await api.get(
    `/infos/offreFormation/${offerId}/niveau/${levelId}/Coefficients`,
    { headers: authHeader(token) },
  );
  return data;
}

export async function getSubjectSchedule(cardId, token) {
  const { data } = await api.get(
    `/infos/seanceEmploi/inscription/${cardId}`,
    { headers: authHeader(token) },
  );
  return data;
}

export async function getBacInfo(uuid, token) {
  const { data } = await api.get(`/infos/bac/${uuid}`, {
    headers: authHeader(token),
  });
  return data;
}

export async function getBacGrades(uuid, token) {
  const { data } = await api.get(`/infos/bac/${uuid}/notes`, {
    headers: authHeader(token),
  });
  return data;
}

export async function getAcademicTranscripts(uuid, cardId, token) {
  const { data } = await api.get(
    `/infos/bac/${uuid}/dias/${cardId}/periode/bilans`,
    { headers: authHeader(token) },
  );
  return data;
}

export async function getAcademicDecision(uuid, cardId, token) {
  const { data } = await api.get(
    `/infos/bac/${uuid}/dia/${cardId}/annuel/bilan`,
    { headers: authHeader(token) },
  );
  return data;
}

export async function getCCGrades(cardId, token) {
  const { data } = await api.get(
    `/infos/controleContinue/dia/${cardId}/notesCC`,
    { headers: authHeader(token) },
  );
  return data;
}

export async function getCurrentAcademicYear(token) {
  const { data } = await api.get('/infos/AnneeAcademicqueEncours', {
    headers: authHeader(token),
  });
  return data;
}

export async function getAcademicPeriods(yearId, token) {
  const { data } = await api.get(`/infos/niveau/${yearId}/periodes`, {
    headers: authHeader(token),
  });
  return data;
}

export async function getDischarge(uuid, token) {
  // تأكد أن هذا المسار صحيح فى الـ API الحقيقى
  const { data } = await api.get(`/${uuid}/qitus`, {
    headers: authHeader(token),
  });
  return data;
}

export async function getDebts(uuid, token) {
  const { data } = await api.get(`/infos/dettes/${uuid}`, {
    headers: authHeader(token),
  });
  return data;
}

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

// مفيد لو حاب تطبع فى الـ console وتشوف فعليًا لأي رابط يتصل
export { API_BASE_URL };
