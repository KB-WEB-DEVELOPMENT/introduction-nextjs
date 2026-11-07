import { auth } from '@/auth'
import { db } from '../../db'
import { users, blogs } from '../../db/schema'
import { eq, isNotNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const getUserWithBlogs = async (username: string) => {

	if (!username) throw new Error("Username is required!");  

	const cleanedUsername = username.trim()

	return db.query.users.findFirst({
		where: eq(users.username, cleanedUsername),
		with: { blogs: true }
	})
}

export const getUsers = async () => {
	
	return db.query.users.findMany()

}

export const checkDuplicateUsername = async (username: string) => {

	if (!username) throw new Error("Username is required!");

	const cleanedUsername = username.trim()	

	const userExists = await db
			.select({ id: user.id })
			.from(users)
			.where(
				eq(
					users.username, cleanedUsername
				)
			)
			.limit(1);

	if (userExists) {
		return  true;
	} else {
		return false;
	}	

}

export const checkUserHasToken = async () => {

	const session = await auth()
	
	if (!session?.user?.email) {
		return null
	}
		
	const hasToken = await db
						.select()
						.from(users)
						.where(
							and(
								eq(users.username, session.user.username),
								isNotNull(session.user.token) 
							)
						)
						.limit(1);
						
	if (hasToken) {
		return  true;
	} else {
		return false;
	}				
	
}

export const generateUserToken = async () => {

	const session = await auth()
	
	if (!session?.user?.email) {
		return null
	}
	
	const generatedToken = crypto.randomUUID(); 
	
	await db.update(users)
		.set({ token: generatedToken })
  .		.where(
			eq(users.username, session.user.username)
		);

	revalidatePath("/me")	
	
	redirect("/me")
		
}
