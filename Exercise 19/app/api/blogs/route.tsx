import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "../../../db"
import { users ) from "../../../db/schema"

export const GET = async (request: NextRequest) => {

  try {

		const authHeader = request.headers.get('Authorization');

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
		
		  return NextResponse.json(
			{ error: 'Unauthorized: Missing or malformed token' },
			{ status: 401 }
		  );
		
		}
	
		const tokenFound = authHeader.split(' ')[1];
	
		const user = db
			.select()
			.from(users)
			.where(
				eq(users.token, tokenFound)
			);

		if (!user) {
		  return NextResponse.json(
			{ error: 'Unauthorized: Invalid token' },
			{ status: 401 }
		  );
		}

		return NextResponse.json({ user }, { status: 200 });

    } catch (error) {
  
		console.error('API Authentication Error:', error);
    
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
