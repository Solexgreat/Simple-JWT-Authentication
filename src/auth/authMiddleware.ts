import {  Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken'

const SECRET_KEY = 'your_secret_key'; //This should be in an .env or config folder

interface request extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
      };
  }

export const authenticate = (req: request,  res: Response, next: NextFunction) => {

    try{
        // Get token from the Header
        const token = req.header('Authorization');
        console.log(token)
        if (!token) {
            res.status(400).json({message: 'token Needed'});
            return;
        }

        // split the Barer from the token
        const jwtToken = token.split(" ")[1];

        // verify token
        const decode = jwt.verify(jwtToken, SECRET_KEY) as { sub: string; email: string; role: string };;

        // attach the decode user data to the request
        req.user = {
            id: decode.sub,
            email: decode.email,
            role: decode.role,
          };;
        next()

    } catch (err) {
        // return error invalid token
        res.status(401).json({message : "invalid token", error: err})
    }
}