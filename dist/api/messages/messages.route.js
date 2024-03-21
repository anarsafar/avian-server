"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blacklist_middleware_1 = __importDefault(require("../../middlewares/blacklist.middleware"));
const jwt_middleware_1 = __importDefault(require("../../middlewares/jwt.middleware"));
const messages_handler_1 = require("./messages.handler");
const middlewares_1 = require("../../middlewares");
const message_validate_1 = require("./message.validate");
const messagesRoute = express_1.default.Router();
messagesRoute.get('/:conversationId', blacklist_middleware_1.default, jwt_middleware_1.default, messages_handler_1.getMessages);
messagesRoute.post('/', blacklist_middleware_1.default, jwt_middleware_1.default, (0, middlewares_1.validateRequest)({ body: message_validate_1.ValidateMessage }), messages_handler_1.addMessage);
exports.default = messagesRoute;
