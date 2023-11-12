import dotenv from 'dotenv';

dotenv.config();

// !Mongo Config
const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_DB_NAME = process.env.DB_NAME || 'test';
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster.mjzp3pa.mongodb.net/${MONGO_DB_NAME}`;

// ! JWT Config
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'superSecretRefreshKey';
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'superSecretAccessKey';

// ! Node enviroment
const NODE_ENV = process.env.NODE_ENV || 'development';

// ! Server Config
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 8080;

// ! App URL
let SERVER_URL = '';
let FRONT_END_URL = '';

// ! Nodemailer Config
const USER = process.env.MAIL_USERNAME || '';
const CLIENT_ID = process.env.OAUTH_CLIENTID || '';
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || '';
const REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN || '';
const REDIRECT_URL = process.env.REDIRECT_URL || 'https://developers.google.com/oauthplayground';
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'Gmail';

if (NODE_ENV === 'development') {
    SERVER_URL = 'http://localhost:8080';
    FRONT_END_URL = 'http://localhost:5173';
} else {
    SERVER_URL = process.env.SERVER_URL || 'http://localhost:8080';
    FRONT_END_URL = process.env.FRONT_END_URL || 'http://localhost:5173';
}
// ! scheduleConfig
const SCHEDULE_CONFIG = process.env.SCHEDULE_CONFIG || '* * * *';

// ! Firebase Config
const FIREBASE_API = process.env.FIREBASE_API || '';
const AUTH_DOMAIN = process.env.AUTH_DOMAIN || '';
const PROJECT_ID = process.env.PROJECT_ID || '';
const STORAGE_BUCKET = process.env.STORAGE_BUCKET || '';
const SENDER = process.env.SENDER || '';
const APP_ID = process.env.APP_ID || '';

// ! Google passport config
const CLIENT_ID_GOOGLE = process.env.OAUTH_CLIENTID_GOOGLE || '';
const CLIENT_SECRET_GOOGLE = process.env.OAUTH_CLIENT_SECRET_GOOGLE || '';

// ! Facebook passport config
const CLIENT_ID_FACEBOOK = process.env.FACEBOOK_APP_ID || '';
const CLIENT_SECRET_FACEBOOK = process.env.FACEBOOK_APP_SECRET || '';

// ! Github passport config
const CLIENT_ID_GITHUB = process.env.GITHUB_APP_ID || '';
const CLIENT_SECRET_GITHUB = process.env.GITHUB_APP_SECRET || '';

export const config = {
    mongo: {
        username: MONGO_USERNAME,
        password: MONGO_PASSWORD,
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    },
    jwtTokens: {
        refreshSecretKey: JWT_REFRESH_SECRET,
        accessSecretKey: JWT_ACCESS_SECRET
    },
    nodemailer: {
        user: USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        emailService: EMAIL_SERVICE,
        redirectURL: REDIRECT_URL
    },
    nodeEnv: NODE_ENV,
    applicationURLs: {
        serverURL: SERVER_URL,
        frontendURL: FRONT_END_URL
    },
    firebaseConfig: {
        apiKey: FIREBASE_API,
        authDomain: AUTH_DOMAIN,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
        messagingSenderId: SENDER,
        appId: APP_ID
    },
    scheduleConfig: SCHEDULE_CONFIG,
    google: {
        clientId: CLIENT_ID_GOOGLE,
        secretKey: CLIENT_SECRET_GOOGLE
    },
    facebook: {
        clientId: CLIENT_ID_FACEBOOK,
        secretKey: CLIENT_SECRET_FACEBOOK
    },
    github: {
        clientId: CLIENT_ID_GITHUB,
        secretKey: CLIENT_SECRET_GITHUB
    }
};
