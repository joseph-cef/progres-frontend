import axios from 'axios';

// نحاول نجيب الـ base URL من متغير البيئة
// في الإنتاج (Netlify) لازم VITE_API_BASE_URL يكون مضبوط
// في التطوير (Vite dev) لو مش مضبوط، نستعمل '/api' (مع proxy مثلاً)
const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_BASE_URL = RAW_API_BASE_URL
  ? RAW_API_BASE_URL.replace(/\/+$/, '') // نحذف أي / زايدة في النهاية
  : (import.meta.env.DEV ? '/api' : ''); // في dev فقط نخليها /api كـ fallback

if (!API_BASE_URL && !import.meta.env.DEV) {
  // هذا يساعدك لو نسيت تضبط VITE_API_BASE_URL في Netlify
  // راح تشوف الخطأ في console في المتصفح
  // eslint-disable-next-line no-console
  console.error(
    '[API] VITE_API_BASE_URL is not defined in production! API calls will fail.',
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor للردود: نرجّع Error نظيف برسالة واضحة
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error.message ||
      'Unknown error';
    return Promise.reject(new Error(message));
  },
);

function authHeader(token) {
  return token ? { Authorization: token } : {};
}

// ─────────────────────────────────────────────
// Authentication
// ─────────────────────────────────────────────

export async function login(username, password) {
  const { data } = await api.post('/authentication/v1/', { username, password });
  return data;
}

// ─────────────────────────────────────────────
// Core student infos
// ─────────────────────────────────────────────

export async function getStudentCards(uuid, token) {
  const { data } = await api.get(`/infos/bac/${uuid}/dias`, {
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

// ─────────────────────────────────────────────
// Grades, groups, subjects
// ─────────────────────────────────────────────

export async function getExamGrades(cardId, token) {
  const { data } = await api.get(
    `/infos/planningSession/dia/${cardId}/noteExamens`,
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

// ─────────────────────────────────────────────
// Schedules & exams
// ─────────────────────────────────────────────

export async function getExamSchedule(offerId, levelId, token) {
  const { data } = await api.get(
    `/infos/Examens/${offerId}/niveau/${levelId}/examens`,
    { headers: authHeader(token) },
  );
  return data;
}

export async function getSubjectSchedule(cardId, token) {
  const { data } = await api.get(`/infos/seanceEmploi/inscription/${cardId}`, {
    headers: authHeader(token),
  });
  return data;
}

// ─────────────────────────────────────────────
// Transport, accommodation, debts, discharge
// ─────────────────────────────────────────────

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

export async function getDischarge(uuid, token) {
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

// ─────────────────────────────────────────────
// Academic years & periods
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Images
// ─────────────────────────────────────────────

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
