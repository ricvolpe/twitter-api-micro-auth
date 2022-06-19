# Twitter API Auth

Twitter API Auth is an Authentication server that takes away the complexity of creating OAuth 1.0a clients to query Twitter API.

By calling a single endpoint, we can instantaneoulsy complete the 3-legged OAuth flow and obtain an access token for each of the authorising users.

## Usage
1. Deploy service
2. Point browser url to `auth` endpoint with `?callback=CALLBACK_URL` parameter
3. Service automatically redirects to specified callback url enriching it with all the authentication data
