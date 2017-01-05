import { request } from './common';

const API = 'http://localhost:8002';

export function saveDoc(body) {
  return request({
    url: `${API}/api/doc`,
    method: 'post',
    body: body
  });
}

export function createRepo(body){
  return request({
    url: `${API}/api/repo`,
    method: 'post',
    body: body
  });
}

export function createTeam(body){
  return request({
    url: `${API}/api/team`,
    method: 'post',
    body: body
  });
}
