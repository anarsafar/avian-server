"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const passport_1 = __importDefault(require("passport"));
const app_1 = require("firebase/app");
const keys_1 = require("./config/keys");
const middlewares = __importStar(require("./middlewares"));
const api_1 = __importDefault(require("./api"));
const social_strategies_1 = __importDefault(require("./api/auth/social/social.strategies"));
const cors_2 = __importDefault(require("./config/cors"));
// import setCache from './middlewares/cache.middleware';
const app = (0, express_1.default)();
(0, app_1.initializeApp)(keys_1.config.firebaseConfig);
passport_1.default.use(social_strategies_1.default.googleStrategy);
passport_1.default.use(social_strategies_1.default.facebookStrategy);
passport_1.default.use(social_strategies_1.default.githubStrategy);
app.use(passport_1.default.initialize());
app.use((0, morgan_1.default)('dev'));
app.use((0, helmet_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)(cors_2.default));
app.use((0, cookie_parser_1.default)());
// app.use(setCache);
app.set('view engine', 'ejs');
app.set('templates', path_1.default.join(__dirname, 'templates'));
app.get('/', (req, res) => {
    res.json({
        message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
    });
});
app.use('/api/v1', api_1.default);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map