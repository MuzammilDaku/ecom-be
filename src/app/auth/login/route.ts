import dbConn from "@/lib/db";
import { jsonResponse } from "@/lib/helpers/jsonResponse";
import { User } from "@/lib/models/users";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export const POST = async (req: NextRequest) => {
    try {
        await dbConn();
        const body = await req.json()
        const { email, password } = body;
        if (!email || !password) {
            return jsonResponse({
                error: "Provide All Fields !"
            }, 200)
        }
        let user = await User.findOne({ email: email });
        if (!user) {
            return jsonResponse({
                error: "User Not Found!"
            }, 200)
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        const token = await jwt.sign({_id:user._id},"IAMMUZAMMILABBAS",{expiresIn:'12h'})
        if(isPasswordValid) {
            return jsonResponse({
                success:true,
                token:token,
                user
            },200)
        }

        return jsonResponse({
            error:"Password is incorrect !"
        }, 201);

    } catch (error) {
        console.log(error)
        return jsonResponse({ error: "Internal Server Error" }, 200)
    }

}