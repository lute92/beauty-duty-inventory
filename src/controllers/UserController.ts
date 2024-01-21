import { NextFunction, Request, Response } from 'express';
import User from '../models/domain/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'bdadmin123';

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(401).send('Invalid username or password');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        return res.status(401).send('Invalid username or password');
    }

    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
};

export const logout = async (req: Request, res: Response) => {
    // In a real-world scenario, you might want to add token blacklisting or other methods.
    res.clearCookie('token'); // Clears the token from the client-side
    res.json({ message: 'Logout successful' });
};