import { db } from '../../db';
import { users, blogs } from '../../db/schema';
import { eq, sql } from "drizzle-orm";

export const getUserWithBlogs = async (username: string) => {

		if (!username) throw new Error("Username is required!");  

		const cleanedUsername = username.trim(); 

		return db.query.users.findFirst({
			where: eq(users.username, cleanedUsername),
			with: { blogs: true },
		})
}

export const getUsers = async () => {

	return db.query.users.findMany()
}

export const checkDuplicateUsername = async (username: string) => {

	if (!username) throw new Error("Username is required!");

	const cleanedUsername = username.trim(); 	

	const userExists = await db
			.select({ id: user.id })
			.from(users)
			.where(
				eq(user.username, cleanedUsername)
			)
			.limit(1);

	if (userExists) {
		return  true;
	} else {
		return false;
	}	

}