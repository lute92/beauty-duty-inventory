import { Request, Response } from 'express';
import {UserModel} from '../models/domain/models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "test"

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (!user) {
        return res.status(401).send('Invalid username or password');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        return res.status(401).send('Invalid password');
    }   

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
};

export const logout = async (req: Request, res: Response) => {
    // In a real-world scenario, you might want to add token blacklisting or other methods.
    res.clearCookie('token'); // Clears the token from the client-side
    res.json({ message: 'Logout successful' });
};