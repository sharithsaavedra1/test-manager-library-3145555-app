const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const getStoredToken = () => localStorage.getItem('library_token');
export const getStoredRole = () => localStorage.getItem('library_role');
export const getStoredUsername = () => localStorage.getItem('library_username');

export const setStoredAuth = (token, role, username) => {
  localStorage.setItem('library_token', token);
  localStorage.setItem('library_role', role);
  localStorage.setItem('library_username', username);
};

export const clearStoredAuth = () => {
  localStorage.removeItem('library_token');
  localStorage.removeItem('library_role');
  localStorage.removeItem('library_username');
};

async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || 'Error en la petición');
    error.code = data?.code || 'UNKNOWN_ERROR';
    error.status = response.status;
    error.details = data?.details || [];
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  login: async (username, password) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setStoredAuth(res.access_token, res.role, username);
    return res;
  },
  logout: () => {
    clearStoredAuth();
  },

  // Users
  createLibrarian: (data) =>
    request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Categories
  getCategories: () => request('/categories'),

  // Books
  getBooks: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set('q', params.q);
    if (params.category_id) searchParams.set('category_id', params.category_id);
    if (params.page) searchParams.set('page', params.page);
    if (params.size) searchParams.set('size', params.size);
    const qs = searchParams.toString();
    return request(`/books${qs ? `?${qs}` : ''}`);
  },
  getBookById: (id) => request(`/books/${id}`),
  createBook: (data) =>
    request('/books', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateBook: (id, data) =>
    request(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteBook: (id) =>
    request(`/books/${id}`, {
      method: 'DELETE',
    }),
  uploadCover: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request(`/books/${id}/cover`, {
      method: 'PUT',
      body: formData,
    });
  },
  deleteCover: (id) =>
    request(`/books/${id}/cover`, {
      method: 'DELETE',
    }),
  getCoverUrl: (id) => `${BASE_URL}/books/${id}/cover`,

  // Members
  getMembers: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set('q', params.q);
    if (params.page) searchParams.set('page', params.page);
    if (params.size) searchParams.set('size', params.size);
    const qs = searchParams.toString();
    return request(`/members${qs ? `?${qs}` : ''}`);
  },
  getMemberById: (id) => request(`/members/${id}`),
  createMember: (data) =>
    request('/members', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Loans
  getLoans: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.from) searchParams.set('from', params.from);
    if (params.to) searchParams.set('to', params.to);
    if (params.status) searchParams.set('status', params.status);
    if (params.member_id) searchParams.set('member_id', params.member_id);
    if (params.page) searchParams.set('page', params.page);
    if (params.size) searchParams.set('size', params.size);
    const qs = searchParams.toString();
    return request(`/loans${qs ? `?${qs}` : ''}`);
  },
  getLoanById: (id) => request(`/loans/${id}`),
  createLoan: (data) =>
    request('/loans', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  returnLoanItem: (loanId, itemId) =>
    request(`/loans/${loanId}/items/${itemId}/return`, {
      method: 'POST',
    }),
  getOverdueLoans: () => request('/loans/overdue'),

  // Reports
  getMostBorrowedReport: (from, to) =>
    request(`/reports/most-borrowed?from=${from}&to=${to}`),
};
