import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import { readingList, blogs, users } from "../../../../db/schema";

async function deleteAllRows() {

  await db.delete(readingList);
  await db.delete(blogs);
  await db.delete(users);

}

export async function DELETE() {
  
	try {
	
		if (process.env.NODE_ENV === "production") {
			return NextResponse.json(
				{ error: "This endpoint is not available in production"},
				{ status: 403},
			)
		}
	
		await deleteAllRows();

		return NextResponse.json(
			{ message: "All rows in tables readingList, blogs and users successfully deleted." },
			{ status: 200 }
		);
		
   } catch (error) {

		console.error("Failed to delete all rows in one or more of the readingList, blogs or users tables:", error);

		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
  }
}
