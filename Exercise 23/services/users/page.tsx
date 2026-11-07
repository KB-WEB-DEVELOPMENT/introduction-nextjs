import { auth } from "@/auth"
import { db } from '../../db'
import { users, blogs, readingList } from '../../db/schema'
import { eq, count, isNotNull, ne , inArray } from "drizzle-orm"
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const getUserWithBlogs = async (username: string) => {

	if (!username) throw new Error("Username is required!")

	const cleanedUsername = username.trim();

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
	
	const cleanedUsername = username.trim();

	const [result] = await db
			.select({ userId: users.id })
			.from(users)
			.where(
				eq(users.username, cleanedUsername)
			)
			.limit(1);

	// could be shortened but shown here that way for clarity
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
						
	// could be shortened but shown here that way for clarity				
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
  .		.where(
			eq(users.username, session.user.username)
		);

	revalidatePath("/me")	
	
	redirect("/me")
		
}

export const addLatestBlogToUsersReadingLists =  async () => {

	const session = await auth()

	if (!session?.user?.email) {
		return null
	}
	
	const [result]  =  await db.select({ total: count() }).from(users);
	
	const usersCount = result.total;
	
	if (usersCount < 2) {
		console.log("The users table contains less than 2 users. We cannnot create a reading list with less than 2 users.");
		return
	}
	
	const [result]  =  db.select({ total: count() }).from(blogs);

	const blogsCount = result.total;

	if (blogsCount === 1) {
	
		const [result] = await db.select({
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
				
				await db.insert(readingList).values({ userId: reader.readerId, blogId: newestBlog.blogId })
				
			}					
			
			return
	}

}

/*  
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

export const getCurrentUserUnreadBlogsCount = async () => {

	const session = await auth()
	
	if (!session?.user?.email) {
		return null;
	}
	
	const foundReaderId = Number(session.user.id);
	
	const [result] = await db
		.select({ total: count() })
		.from(readingList)
		.where(
			and(
			  eq(readingList.userId, foundReaderId),
			  eq(readingList.read,false)
			)
	     );
		 
	return result.total;
	
}

export const getCurrentUserUnreadBlogs = async () => {

	const session = await auth()
	
	if (!session?.user?.email) {
		return null;
	}
	
	const foundReaderId = Number(session.user.id);
	
	const subQuery = db
	  .select({ foundBlogId: readingList.blogId })
	  .from(readingList)
	  .where(
			and(
			  eq(readingList.userId, foundReaderId),
			  eq(readingList.read,false)
			)
	  );

	const unreadBlogs = await db
	  .select({
		  blogId: blogs.id,
		  title: blogs.title,  
	  })
	  .from(blogs)
	  .where(
		inArray(blogs.id, subQuery) 
	  );

	return unreadBlogs

}

export const getCurrentUserBlogsReadCount = async () => {

	const session = await auth()
	
	if (!session?.user?.email) {
		return null;
	}
	
	const foundReaderId = Number(session.user.id);
	
	const [result] = await db
		.select({ total: count() })
		.from(readingList)
		.where(
			and(
			  eq(readingList.userId, foundReaderId),
			  eq(readingList.read,true)
			)
	     );
		 
	return result.total;


}

export const getCurrentUserBlogsRead = async () => {

	const session = await auth()
	
	if (!session?.user?.email) {
		return null;
	}
	
	const foundReaderId = Number(session.user.id);
	
	const subQuery = db
	  .select({ foundBlogId: readingList.blogId })
	  .from(readingList)
	  .where(
			and(
			  eq(readingList.userId, foundReaderId),
			  eq(readingList.read,true)
			)
	  );

	const blogsRead = await db
	  .select({
		  blogId: blogs.id,
		  title: blogs.title,  
	  })
	  .from(blogs)
	  .where(
		inArray(blogs.id, subQuery) 
	  );

	return blogsRead

}
