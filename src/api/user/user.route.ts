import express, { Router } from 'express';
import authenticateToken from '../../middlewares/jwt.middleware';
import blacklisted from '../../middlewares/blacklist.middleware';
import { deleteAvatar, deleteUser, getUser, updateUser } from './user.handler';
import uploadImage from '../../middlewares/upload.middleware';

const userRoute: Router = express.Router();

userRoute.get('/', blacklisted, authenticateToken, getUser);
userRoute.patch('/', blacklisted, authenticateToken, uploadImage, updateUser);
userRoute.delete('/', blacklisted, authenticateToken, deleteUser);
userRoute.delete('/delete-avatar', blacklisted, authenticateToken, deleteAvatar);

export default userRoute;
