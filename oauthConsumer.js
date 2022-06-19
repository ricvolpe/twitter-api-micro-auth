const OAuth = require('oauth')

const CONSUMER_KEY = process.env['TWTTR_API_KEY']
const CONSUMER_SECRET = process.env['TWTTR_API_KEY_SECRET']
const CALLBACK_URL = process.env['TWTTR_CALLBACK_URL']

var oauthConsumer = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  CONSUMER_KEY, CONSUMER_SECRET,
  '1.0A', encodeURI(CALLBACK_URL), 'HMAC-SHA1'
)

async function getRequestToken() {
  return new Promise((resolve, reject) => {
    oauthConsumer.getOAuthRequestToken(
      function (error, token, tokenSecret, results) {
      return error
        ? reject(new Error('Error getting OAuth request token'))
        : resolve({ token, tokenSecret, results })
    })
  })
}

async function getAccessToken({ token, tokenSecret, verifier }) {
  return new Promise((resolve, reject) => {
    oauthConsumer.getOAuthAccessToken(
      token, tokenSecret, verifier, 
      function (error, accessToken, accessTokenSecret, results) {
      return error
        ? reject(new Error('Error getting OAuth access token'))
        : resolve({ accessToken, accessTokenSecret, results })
    })
  })
}

module.exports = {
  getRequestToken: getRequestToken,
  getAccessToken: getAccessToken
}
