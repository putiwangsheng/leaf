import { request } from './common';

const API = 'http://localhost:8002';

export { API };

// 获取仓库列表
export function getPersonalRepoList(){
  return request({
    url: `${API}/api/repo`,
  });
}

// 获取仓库
export function getRepoInfo(repoId){
  if(!repoId){
    repoId = '';
  }

  return request({
    url: `${API}/api/repo/${repoId}`
  });
}

// 获取仓库文档
export function getRepoDoc(repoId){
  if(!repoId){
    repoId = '';
  }

  return request({
    url: `${API}/api/doc?repoId=${repoId}`
  });
}

// 保存文档
export function saveDoc(body) {
  return request({
    url: `${API}/api/doc`,
    method: 'post',
    body: body
  });
}

// 获得文档
export function getDocInfo(docId){
  if(!docId){
    docId = '';
  }
  return request({
    url: `${API}/api/doc/${docId}`,
  });
}

// 修改文档
export function modifyDoc(docId, body){
  return request({
    url: `${API}/api/doc/${docId}`,
    method: 'put',
    body: body
  });
}

// 删除文档
export function deleteRepoDoc(docId){
  return request({
    url: `${API}/api/doc/${docId}`,
    method: 'delete'
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

// 创建团队
export function createTeam(body){
  return request({
    url: `${API}/api/team`,
    method: 'post',
    body: body
  });
}

// 获取团队信息
export function getTeamInfo(teamId){
  if(!teamId){
    teamId = '';
  }
  return request({
    url: `${API}/api/team/${teamId}`,
  });
}

// 获取个人信息
export function getUserInfo(userId){
  if(!userId){
    userId = '';
  }
  return request({
    url: `${API}/api/user/${userId}`,
  });
}

// 修改个人信息
export function modifyUserInfo(userId, body){
  return request({
    url: `${API}/api/user/${userId}`,
    method: 'put',
    body: body
  });
}
