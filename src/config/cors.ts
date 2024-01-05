import { config } from './keys';

const corsOptions = {
    origin: config.applicationURLs.frontendURL,
    credentials: true
};

export default corsOptions;
