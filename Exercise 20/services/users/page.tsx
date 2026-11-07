import { auth } from "@/auth"
import { db } from '../../db'
import { users, blogs, readingList } from '../../db/schema'
import { eq, count, isNotNull, ne , inArray } from "drizzle-orm"

export const getUserWithBlogs = async (username: string) => {

		if (!username) throw new Error("Username is required!")

		const cleanedUsername = username.trim()

		users = await db.query.users.findFirst({
			where: eq(users.username, cleanedUsername),
			with: { blogs: true },
		});
		
		return users
}

export const getUsers = async () => {
	
	const users =  await db
			.select()
			.from(users);

	return users
}

export const checkDuplicateUsername = async (username: string) => {

	if (!username) throw new Error("Username is required!");
	
	const cleanedUsername = username.trim()

	const [result] = await db
			.select({ userId: users.id })
			.from(users)
			.where(
				eq(users.username, cleanedUsername)
			)
			.limit(1);

	// could be shortened but for shown here that way for clarity
	if (result.userId) {
		return true
	} else {
		return false
	}	

}

export const checkUserHasToken = async () => {

	const session = await auth()
	
	if (!session?.user?.email) {
		return null;
	}
		
	const [result]  = await db
					 .select({ tokenFound: users.token })
					 .from(users)
					 .where(
						and(
							eq(users.username, session.user.username),
							isNotNull(session.user.token) 
						)
					  )
					  .limit(1);
						
	// could be shortened but for shown here that way for clarity				
	if (result.tokenFound) {
		return  true
	} else {
		return false
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
  .		.where(eq(users.username, session.user.username));

	revalidatePath("/me")	
	
	redirect("/me")
		
}

/*
Our assumption (below) based on the previous 19 related exercises, in order to do exercise 20:

Assumption: There are at least two different users in the users table.
            It does not make sense to create a reading list otherwise.

			step 1:

			We check this assumption within the addLatestBlogToUsersReadingLists() function,
			knowing that a separate function ought to be made for that purpose only.
			
			step 2:
			
			If the assumption turns out to be true, we check if the blogs table entries count   
			is 1 or greater than 1. ( We know the blogs table entries count
			must be at least 1 because the function addLatestBlogToUsersReadingLists() runs
			right after the addBlog() function).
			
			step 3:
			
			If the blogs table entries count is 1, we add just one row to the readingList table.

			If the blogs table entries count is greater than 1, we need to find 
			some systematic way to populate the readingList table.
			
			In either case, we do this by differentitating between two types of users for each blog:
			
			author id: the user id of the blog author
			reader id: the user id of any user other than the blog author's user id.			
*/

export const addLatestBlogToUsersReadingLists =  async () => {

	const session = await auth()

	if (!session?.user?.email) {
		return null
	}
	
	const usersCount  =  db.select({ count: count() }).from(users);
	
	if (usersCount < 2) {
		console.log("The users table contains less than 2 users. We cannnot create a reading list with less than 2 users.");
		return
	}
	
	const blogsCount  =  db.select({ count: count() }).from(blogs);

	if (blogsCount === 1) {
	
		const result = await db.select({
			blogId: blogs.id,
			authorId: blogs.userId,
		}).from(blogs);

		const foundBlogId = result.blogId;
		const authorId = result.authorId;
		
		const readersSubquery = db
				.select({
					readerId: users.id,
				})
				.from(users)
				.where(ne(users.id, authorId)) 
				.as('readers_subquery');
	
		await db
			.insert(readingList)
			.select(
				db
				  .select({
						userId: readersSubquery.readerId,
						blogId: foundBlogId,
				  })
				  .from(users)
				  .crossJoinLateral(readersSubquery) 
			);
	
		return
		
	} else {
	
			const [newestBlog] = await db.select({ blogId: blogs.id, authorId: blogs.userId })
								      .from(blogs);
									  .orderBy(desc(blogs.id))
									  .limit(1);
					
			const readersList = await db.select(readerId: users.id)
										.from(users)
									    .where(ne(users.id, newestBlog.authorId));
				
			for (const reader of readersList) {
				
				await db.insert(readingList).
					     values({ userId: reader.readerId, blogId: newestBlog.blogId })
				
			}					
			
			return
	}

}

/*  As formulated in exercise 20:  
	If the "read" field value is set to false, the blog IS on a reader's reading list.
	If the "read" field value is set to true, the blog IS NOT on a reader's reading list.
*/
export const getCurrentUserReadingList = async () => {

	const session = await auth()
	
	if (!session?.user?.email) {
		return null;
	}
	
	const foundReaderId = Number(session.user.id);
	
	const readerSubquery = db
	  .select({ foundBlogId: readingList.blogId })
	  .from(readingList)
	  .where(
			and(
			  eq(readingList.userId, foundReaderId),
			  eq(readingList.read,false)
			)
	  );

	const readerBlogsList = await db
	  .select({
		  blogId: blogs.id,
		  title: blogs.title,
		  url: blogs.url,
		  likes: blogs.likes	  
	  })
	  .from(blogs)
	  .where(
		inArray(blogs.id, readerSubquery) 
	  );

	return readerBlogsList

}


export const getCurrentReaderBlogReadStatus = async (id: integer) => {
		
	if (!id) throw new Error("Blog ID is required!");
	
	const session = await auth()
	
	if (!session?.user?.email) {
		return null
	}
	
	const foundReaderId = Number(session.user.id);		
		
	const [result]  = await db
			.select({
				readStatus: readingList.read  
			})
			.from(readingList) 		
			.where(
				and(
					eq(readingList.userId, foundReaderId),
					eq(readingList.blogId,id)
				)
			)	
			.limit(1);	        
				
	return result.readStatus			
				 .				
}
