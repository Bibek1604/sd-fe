/**
 * One function per backend endpoint. Components import from here rather than
 * building URLs themselves, so every route lives in a single place.
 * All functions resolve to the response body or reject with an ApiError.
 */
import client from './client';

const data = promise => promise.then(res => res.data);

export const authApi = {
  login:  body => data(client.post('/auth/login', body)),
  signup: body => data(client.post('/auth/signup', body)),
};

export const gameApi = {
  getIncident: caseId => data(client.get('/game/incident', { params: { caseId } })),
  start:       incidentId => data(client.post('/game/start', { incidentId })),
  clueClick:   (attemptId, hotspotId) => data(client.post('/game/clue-click', { attemptId, hotspotId })),
  submitWhy:   (attemptId, whyOrder, optionId) => data(client.post('/game/submit-why', { attemptId, whyOrder, optionId })),
  finish:      (attemptId, timeTakenSeconds, timedOut) => data(client.post('/game/finish', { attemptId, timeTakenSeconds, timedOut })),
};

export const employeeApi = {
  getHistory: () => data(client.get('/employee/history')),
};

export const adminApi = {
  getResults:     () => data(client.get('/admin/results')),
  getEmployees:   () => data(client.get('/admin/employees')),
  deleteEmployee: id => data(client.delete(`/admin/employees/${id}`)),
};

export { ApiError, getErrorMessage } from './errors';
export { default as client } from './client';
