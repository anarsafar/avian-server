"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_middleware_1 = __importDefault(require("../../middlewares/jwt.middleware"));
const blacklist_middleware_1 = __importDefault(require("../../middlewares/blacklist.middleware"));
const user_handler_1 = require("./user.handler");
const upload_middleware_1 = __importDefault(require("../../middlewares/upload.middleware"));
const userRoute = express_1.default.Router();
userRoute.get('/', blacklist_middleware_1.default, jwt_middleware_1.default, user_handler_1.getUser);
userRoute.patch('/', blacklist_middleware_1.default, jwt_middleware_1.default, upload_middleware_1.default, user_handler_1.updateUser);
userRoute.delete('/', blacklist_middleware_1.default, jwt_middleware_1.default, user_handler_1.deleteUser);
userRoute.delete('/delete-avatar', blacklist_middleware_1.default, jwt_middleware_1.default, user_handler_1.deleteAvatar);
exports.default = userRoute;
//# sourceMappingURL=user.route.js.map