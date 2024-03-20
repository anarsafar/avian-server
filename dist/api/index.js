"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const local_routes_1 = __importDefault(require("./auth/local/local.routes"));
const confirmation_route_1 = __importDefault(require("./confirmation/confirmation.route"));
const refresh_route_1 = __importDefault(require("./refresh/refresh.route"));
const reset_route_1 = __importDefault(require("./resetPassword/reset.route"));
const user_route_1 = __importDefault(require("./user/user.route"));
const social_route_1 = __importDefault(require("./auth/social/social.route"));
const contacts_route_1 = __importDefault(require("./contacts/contacts.route"));
const conversation_route_1 = __importDefault(require("./conversation/conversation.route"));
const messages_route_1 = __importDefault(require("./messages/messages.route"));
const notifications_route_1 = __importDefault(require("./notifications/notifications.route"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json({
        message: 'API - 👋🌎🌍🌏'
    });
});
router.use('/auth', local_routes_1.default);
router.use('/auth', social_route_1.default);
router.use('/confirmation', confirmation_route_1.default);
router.use('/refresh', refresh_route_1.default);
router.use('/reset-password', reset_route_1.default);
router.use('/user', user_route_1.default);
router.use('/contacts', contacts_route_1.default);
router.use('/conversations', conversation_route_1.default);
router.use('/messages', messages_route_1.default);
router.use('/notifications', notifications_route_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map