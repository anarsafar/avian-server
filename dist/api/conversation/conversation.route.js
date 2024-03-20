"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blacklist_middleware_1 = __importDefault(require("../../middlewares/blacklist.middleware"));
const jwt_middleware_1 = __importDefault(require("../../middlewares/jwt.middleware"));
const conversation_handler_1 = require("./conversation.handler");
const conversationRoute = express_1.default.Router();
conversationRoute.get('/', blacklist_middleware_1.default, jwt_middleware_1.default, conversation_handler_1.getConversations);
conversationRoute.delete('/:conversationId', blacklist_middleware_1.default, jwt_middleware_1.default, conversation_handler_1.deleteConversation);
exports.default = conversationRoute;
//# sourceMappingURL=conversation.route.js.map