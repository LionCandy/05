
//load env var
const dotenv = require('dotenv');
const result = dotenv.config()

if (result.error) {
  throw result.error
}

console.log(result.parsed)

//load vue js modal
//const { VModal } = require('vue-js-modal');
//import VModal from 'vue-js-modal';
//Vue.use(VModal);

const server = require('server');
const { get, post, put , del } = server.router;
const { render } = server.reply;
const google = require('./util/google-utils');

const google_url = google.getUrlGoogle();
//const home = get('/', ctx => render('index.hbs',{ google_client_id : process.env.CLIENT_ID}));
console.log(google_url);
const home = get('/', ctx => render('index02.hbs',{ google_url : google_url, google_client_id : process.env.CLIENT_ID }));

const oauth = [
    get('/oauth2callback',  async (req, res) => {
        console.log('Code'); 
        console.log(req.query.code); 
        console.log('Session'); 
        console.log(req.session); 
        const data = google.getGoogleAccountFromCode(req.query.code);
        console.log(data);
        return data;

    })
];

module.exports = server(home,oauth);