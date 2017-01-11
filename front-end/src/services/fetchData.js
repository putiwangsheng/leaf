import { request } from './common';

const API = 'http://localhost:8002';

// 获取仓库列表
export function getPersonalRepoList(){
  return request({
    url: `${API}/api/repo`,
  });
}

// 获取仓库
export function getRepoInfo(){
  return request({
    url: `${API}/api/repo`
  });
}

export function saveDoc(body) {
  return request({
    url: `${API}/api/doc`,
    method: 'post',
    body: body
  });
}

// 创建仓库
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
