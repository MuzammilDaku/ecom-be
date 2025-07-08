import dbConn from "@/lib/db";
import { jsonResponse } from "@/lib/helpers/jsonResponse";
import { User } from "@/lib/models/users";
import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken'


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
        const { token } = body;
        if (!token) {
            return jsonResponse({
                error: "Provide All Fields !"
            }, 200)
        }

        const verify : any= await jwt.verify(token,"IAMMUZAMMILABBAS")
        if(verify._id) {
            const user = await User.findById(verify._id)
            return jsonResponse({user},200)
        }
        
    } catch (error) {
        // console.log(error)
        return jsonResponse({ error: "Token Expired" }, 200)
    }

}