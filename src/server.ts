import mongoose from 'mongoose';

import { config } from './config/keys';
import app from './app';
import { scheduler } from './services/cleanup.service';
import { initSocket } from './socket';

mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        console.log('MongoDB connected successfully');

        const server = require('http').Server(app);
        initSocket(server);

        server.listen(config.server.port, () => {
            console.log(`Server is running on port ${config.server.port}`);
            scheduler();
        });
    })
    .catch((err) => console.error(err));
