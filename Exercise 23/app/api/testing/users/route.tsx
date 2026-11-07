import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import { users } from "../../../../db/schema";

async function insertUserRow(data: { username: string; name: string; password: string }) {
  
  return await db.insert(users).values(data).returning();

}

export async function POST(req: NextRequest) {

  try {
  
		if (process.env.NODE_ENV === "production") {
		
			return NextResponse.json(
				{ error: "This endpoint is not available in production"},
				{ status: 403},
			)
		}
        		
		const body = await req.json(); 
		
		const { username, name, password } = body;
		
		// Typically, validation for username, name, and password would take place here.

		const newRecord = await insertUserRow({ username, name, password });

		return NextResponse.json(
		  { message: "New entry in Users table inserted successfully:", data: newRecord },
		  { status: 201 }
		);
	} catch (error) {
			console.error("Failed to insert new row in Users table:", error);
			
			return NextResponse.json(
				{ error: "Internal Server Error" },
				{ status: 500 }
			);
	}
}
