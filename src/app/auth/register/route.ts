import dbConn from "@/lib/db";
import { jsonResponse } from "@/lib/helpers/jsonResponse";
import { User } from "@/lib/models/users";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'


export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}


export const POST = async (req: NextRequest) => {
    try {
        await dbConn();
        const body = await req.json()
        const { name, email, password } = body;
        if (!name || !email || !password) {
            return jsonResponse({
                error: "Provide All Fields !"
            }, 200)
        }
        let user = await User.findOne({ email: email });
        if (user) {
            return jsonResponse({
                error: "User With That Email Already Exists!"
            }, 200)
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        return jsonResponse(newUser, 201);

    } catch (error) {
        console.log(error)
        return jsonResponse({ error: "Internal Server Error" }, 200)
    }

}