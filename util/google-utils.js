'use strict';

const { google } = require('googleapis');

const googleConfig = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirect: process.env.REDIRECT
}

/**
 * Create the google auth object which gives us access to talk to google's apis.
 */
function createConnection(){
    console.log(googleConfig);
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect 
    );

}

/**
 * This scope tells google what information we want to request.
 */
const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
];

/**
 * Get a url which will open the google sign-in page and 
 * request access to the scope provided (such as calendar events).
 */
function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: defaultScope
    });
}

function getGooglePlusApi(auth) {
    return google.plus({ version: 'v1', auth });
}
/**
 * Create the google url to be sent to the client.
 */
module.exports = {

    getUrlGoogle : () => {
        const auth = createConnection();
        console.log(auth);
        const url = getConnectionUrl(auth);
        console.log(url);
        return url;
    },
    getGoogleAccountFromCode: async (code) => {
        const auth = createConnection();
        const data = await auth.getToken(code);
        const tokens = data.tokens;
        auth.setCredentials(tokens);
        const plus = getGooglePlusApi(auth);
        const me = await plus.people.get({ userId: 'me' });
        const userGoogleId = me.data.id;
        const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
        return {
            id: userGoogleId,
            email: userGoogleEmail,
            tokens: tokens,
        };
      }
}