import {  Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken'

const SECRET_KEY = 'your_secret_key';

interface request extends Request {
    user?: any;
  }

export const authenticate = (req: request,  res: Response, next: NextFunction) => {

    try{
        // Get token from the Header
        const token = req.header('Authorization');
        if (!token) {
            res.status(400).json({message: 'token Needed'});
            return;
        }

        // split the Barer from the token
        const jwtToken = token.split(" ")[1];

        // verify token
        const decode = jwt.verify(jwtToken, SECRET_KEY) as { sub: string; email: string; role: string };;

        // attach the decode user data to the request
        req.user = decode;
        next()

    } catch (err) {
        // return error invalid token
        res.status(401).json({message : "invalid token", error: err})
    }
}