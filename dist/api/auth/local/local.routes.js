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
const localAuthHandler = __importStar(require("./local.handlers"));
const middlewares_1 = require("../../../middlewares");
const limiter_middleware_1 = __importDefault(require("../../../middlewares/limiter.middleware"));
const local_validate_1 = require("./local.validate");
const blacklist_middleware_1 = __importDefault(require("../../../middlewares/blacklist.middleware"));
const localAuthRouter = express_1.default.Router();
localAuthRouter.post('/signup', (0, middlewares_1.validateRequest)({ body: local_validate_1.SignupValidate }), localAuthHandler.signUp);
localAuthRouter.post('/login', limiter_middleware_1.default, (0, middlewares_1.validateRequest)({ body: local_validate_1.LoginValidate }), localAuthHandler.logIn);
localAuthRouter.post('/logout', blacklist_middleware_1.default, localAuthHandler.logOut);
localAuthRouter.post('/delivered', localAuthHandler.delivered);
exports.default = localAuthRouter;
