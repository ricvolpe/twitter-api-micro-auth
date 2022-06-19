const express = require("express")
const oauthConsumer = require('./oauthConsumer')
const queryString = require("query-string")
const session = require('express-session')
const url = require('url');  

const COOKIE_SECRET =  process.env['COOKIE_SECRET']
const TWTTR_AUTH_URL = 'https://api.twitter.com/oauth/authorize'

const app = express();

app.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

app.use(session({
  secret: COOKIE_SECRET, 
  secure: false, 
  resave: true, 
  saveUninitialized: true 
}))

app.get('/', (_req, res) => {
  res.send('Twitter API Authentication Service');
});

app.get('/auth', async (req, res) => {
  const { callback } = 
    queryString.parse(req.url.substring('/auth?'.length)) || {}
  if (!callback) {
    res.status(400).send('Missing required parameter callback')
    return;
  } else {
    req.session.callback = callback
  }
  const tokensResponse = await oauthConsumer.getRequestToken()
  if (tokensResponse) {
    const { token, tokenSecret } = tokensResponse
    req.session.token = token
    req.session.tokenSecret = tokenSecret
    const authorizationUrl = `${TWTTR_AUTH_URL}?oauth_token=${token}`
    res.statusCode = 301
    res.setHeader('Location', authorizationUrl)
    res.end()
  }
});

app.get('/callback', (req, res) => {
  const { oauth_verifier: verifier, oauth_token: token } = 
    queryString.parse(req.url.substring('/callback?'.length)) || {}

  const { tokenSecret, callback } = req.session
  oauthConsumer.getAccessToken({ token, tokenSecret, verifier})
    .then(({ accessToken, accessTokenSecret, results }) => {
      res.redirect(url.format({
        pathname: decodeURI(callback),
        query: {
          token,
          tokenSecret,
          verifier,
          accessToken,
          accessTokenSecret,
          ...results
        }
      }))
    })

});


app.listen(3000, () => console.log('server started'));
