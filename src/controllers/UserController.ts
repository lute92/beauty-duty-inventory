import { Request, Response } from 'express';
import User from '../models/domain/User';
import jwt from 'jsonwebtoken';

const secretKey = 'bdadmin123';

export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    // Check if the user exists and the password is correct (replace with DB query)
    const user: any = User.find((u: any) => u.username === username && u.password === password);

    if (!user) {
        res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create and send a JWT token
    const token = jwt.sign({ userId: user._id, username: user.username }, secretKey, { expiresIn: '100000' });
    res.json({ token });
}

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    // Verify JWT token
    const token: any = req.headers.authorization;

    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded: any = jwt.verify(token, secretKey);
        res.json({ userId: decoded.userId, username: decoded.username });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}