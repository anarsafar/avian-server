"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const keys_1 = require("./keys");
const corsOptions = {
    origin: keys_1.config.applicationURLs.frontendURL,
    credentials: true
};
exports.default = corsOptions;
//# sourceMappingURL=cors.js.map