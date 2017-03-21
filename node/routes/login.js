const superagent = require('superagent');

const authorize_api = 'https://graph.qq.com/oauth2.0';
const APPID = '101388260';
const APPKEY = 'ab3ce1001f995d83c3b69248bc295d2b';
const redirectUri = 'http://changqi.site';

let accessToken;
let openId;

module.exports = function(app) {
  app.get('/api/userInfo', (req, res) => {
    let code = req.query.code;

    if (!code) {
      return res.json({
        code: 10001,
        message: 'code is needed',
      })
    }

    getAccessToken(code, (err, data) => {
      if (err) {
        console.log(err);
        return res.json({
          code: 10002,
          message: err
        })
      }

      let accessTokenInfo = data.split('&');
      let tokenString = accessTokenInfo[0];
      let expiresString = accessTokenInfo[1];
      let refreshString = accessTokenInfo[2];

      if(!tokenString || !expiresString || !refreshString) {
        return res.json({
          code: 10001,
          message: 'code has outTime',
        })
      }

      data = {
        access_token: tokenString.split('=')[1],
        expires_in: expiresString.split('=')[1],
        refresh_token: refreshString.split('=')[1]
      }

      accessToken = data.access_token;

      getOpenId((err, openIdData) => {
        if (err) {
          console.log(err);
          return res.json({
            code: 10002,
            message: err
          })
        }

        let openIdString = openIdData.split(',')[1];
        let openIdTemp = openIdString.split(':')[1];
        openId = openIdTemp.split('"')[1];

        res.cookie('openId', openId);

        getUserInfo((err, userInfo) => {
          if (err) {
            console.log(err);
            return res.json({
              code: 10002,
              message: err
            })
          }

          res.json({
            code: 200,
            data: userInfo
          })
        })
      })
    });
  })
}

// 获取 accessToken
function getAccessToken(code, callback) {
  const endpoint = `${authorize_api}/token?grant_type=authorization_code&client_id=${APPID}&client_secret=${APPKEY}&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  superagent.get(endpoint)
    .end((err, res) => {
      if (err) {
        callback(err);
      } else {
        callback(null, res.text);
      }
    });
}

// 获取 openId
function getOpenId(callback) {
  const endpoint = `${authorize_api}/me?access_token=${accessToken}`;

  superagent.get(endpoint)
    .end((err, res) => {
      if (err) {
        callback(err);
      } else {
        callback(null, res.text);
      }
    });
}

// 获取用户信息
function getUserInfo(callback) {
  const endpoint = `https://graph.qq.com/user/get_user_info?access_token=${accessToken}&oauth_consumer_key=${APPID}&openid=${openId}`;

  superagent.get(endpoint)
    .end((err, res) => {
      if (err) {
        callback(err);
      } else {
        callback(null, res.text);
      }
    });
}
