import { getGraphQLEndpoint } from '../../../utils/environment';

export const apiUrl = (path: string) => {
  const origin = getGraphQLEndpoint().replace(/\/graphql\/?$/, '');
  return `${origin}${path}`;
};

export const apiFetch = (path: string, init: RequestInit = {}) => {
  const headers = new Headers(init.headers);
  const token = localStorage.getItem('baphomet-token');
  if (token && !headers.has('Authorization')) {
    headers.set(
      'Authorization',
      token.startsWith('Bearer ') ? token : `Bearer ${token}`
    );
  }
  if (init.body instanceof FormData) {
    headers.delete('Content-Type');
  }
  return fetch(apiUrl(path), { ...init, headers });
};
