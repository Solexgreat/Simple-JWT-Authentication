import { Request, Response } from "express";
import { users } from '../auth/authService'
import argon2 from 'argon2'



export const signUp = async (req: Request, res: Response) => {
    try {
        // get the rquest body and verify if the requst details is complete
        const {email, password, name} = req.body
        if (!email || !password || !name) return res.status(400).json({message: "Incomplete details"});

        // Verify if the user exist
        let user = users.find((u) => u.email === email)
        if (user) return res.status(403).json({message: "User already exist"})

        const hashedPassword = await  argon2.hash(password);

        const newUser = {
            id: String(users.length + 1), // Generate a unique ID
            name,
            email,
            password: hashedPassword,
            role: "user"
          };
        // create new User
        users.push(newUser)

        // return success
        return res.status(200).json({message: "SignUp successfull", user: newUser})

    } catch (err){
        // Handle error
        return res.status(500).json({message: "Internal server error", error: err})
    }
}