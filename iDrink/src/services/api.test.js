import axios from 'axios';
import api, {session} from './api';

// Fake transport: 401 for the stale token, 200 once refreshed
const adapter = (config) => {
  const res = (status, data) => (status < 400
    ? Promise.resolve({status, data, headers: {}, config})
    : Promise.reject(Object.assign(new Error(`HTTP ${status}`), {config, response: {status, data}})));
  if (config.url.endsWith('api/auth/refresh')) {
    return JSON.parse(config.data).refreshToken === 'good' ? res(200, {accessToken: 'new'}) : res(401, {});
  }
  return config.headers.Authorization === 'Bearer new' ? res(200, 'ok') : res(401, {});
};

beforeEach(() => {
  api.defaults.adapter = adapter;
  axios.defaults.adapter = adapter;
  localStorage.clear();
});

test('concurrent 401s share one refresh, then retry with the new token', async () => {
  session.save({accessToken: 'old', refreshToken: 'good'});
  const results = await Promise.all([api.get('api/machines'), api.get('api/cocktails')]);
  expect(results.map((r) => r.data)).toEqual(['ok', 'ok']);
  expect(session.get()).toEqual({accessToken: 'new', refreshToken: 'good'});
});

test('failed refresh clears the session (logs out)', async () => {
  session.save({accessToken: 'old', refreshToken: 'bad'});
  await expect(api.get('api/machines')).rejects.toThrow('HTTP 401');
  expect(session.get()).toBeNull();
});
