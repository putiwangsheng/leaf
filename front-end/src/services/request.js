import fetch from 'isomorphic-fetch';

const API = 'http://changqi.site';

export { API };

export function request(option) {
  let { url, method, body } = option;

  if (!method) {
    method = 'get';
  }

  let fetchOption = {
    method: method,
    credentials: 'include'
  };

  if(method !== 'get' && method !== 'delete'){
    fetchOption.headers = {
      'Content-Type': 'application/json'
    };

    fetchOption.body = JSON.stringify(body);
  }

  return fetch(url, fetchOption)
    .then(res => { return res.json();})
    .then(resData => {
      return resData;
    }).catch(error => {
      console.log(error);
    });
}
