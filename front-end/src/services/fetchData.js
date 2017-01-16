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
  return request({
    url: `${API}/api/repo/${repoId}`
  });
}

// 获取仓库文档
export function getRepoDoc(repoId){
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
  return request({
    url: `${API}/api/doc/${docId}`,
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
export function getTeamInfo(){
  return request({
    url: `${API}/api/team`,
  });
}

// 获取个人信息
export function getUserInfo(){
  return request({
    url: `${API}/api/user`,
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
