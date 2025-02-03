import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key'; //This should be in an .env or config folder

interface request extends Request {
    user?: {
      id: string;
      email: string;
      role: string;
    };
  }

interface User {
    id: string,
    name: string,
    email: string,
    password: string,
    role: string,
}

export const users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword1', // In a real app, passwords should be hashed
      role: 'user',
    },
    {
      id: '2',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'hashedpassword2', // In a real app, passwords should be hashed
      role: 'admin',
    },
  ];


export const login = async (req: Request, res: Response )  => {

    try {

        const user = req.body;
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
         }

        // validate User
        if(!validateUser(user.email, user.password)) res.status(400).json({message: "User not found"})

        //  generate token
        const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "1h"})

        // return success
        res.status(200).json(token)

    } catch (err) {
        // Handel Error
        res.status(500).json({message: "Internal Error", error: err})
    }
}


export const validateUser = (email: string, password:string) => {

    try {
        // get email and password and verify if it exist
        const user = users.find((u) => u.email === email && u.password === password)
        if (!user) return false

        return true
    } catch (err) {
        // Handel Error
        return false
    }
}

export const authorize = (allowedRoles: string[])  => {
    return (req: request, res: Response, next: NextFunction)=> {
        const userRole = req.user?.role

        if (!userRole || !allowedRoles.includes(userRole)) {
             res.status(403).json({message: "User doesn't have access"})
        }

        next();
    }
}
