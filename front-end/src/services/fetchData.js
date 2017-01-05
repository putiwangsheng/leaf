import { request } from './common';

const API = 'http://localhost:8002';

export function saveDoc(body) {
  return request({
    url: `${API}/api/doc`,
    method: 'post',
    body: body
  });
}
