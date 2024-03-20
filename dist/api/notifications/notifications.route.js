"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blacklist_middleware_1 = __importDefault(require("../../middlewares/blacklist.middleware"));
const jwt_middleware_1 = __importDefault(require("../../middlewares/jwt.middleware"));
const notifications_handler_1 = require("./notifications.handler");
const notifications_validate_1 = require("./notifications.validate");
const middlewares_1 = require("../../middlewares");
const notificationRoute = express_1.default.Router();
notificationRoute.get('/', blacklist_middleware_1.default, jwt_middleware_1.default, notifications_handler_1.getNotifications);
notificationRoute.post('/profile', blacklist_middleware_1.default, jwt_middleware_1.default, notifications_handler_1.profileNotification);
notificationRoute.post('/contact/:contactId', blacklist_middleware_1.default, jwt_middleware_1.default, notifications_handler_1.contactNotification);
notificationRoute.post('/:searchParam', (0, middlewares_1.validateRequest)({ body: notifications_validate_1.ValidateNotifaction }), notifications_handler_1.addNotification);
exports.default = notificationRoute;
//# sourceMappingURL=notifications.route.js.map