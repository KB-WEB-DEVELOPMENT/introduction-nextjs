import { db } from '../../db'
import { users, blogs, readingList } from '../../db/schema'
import { eq, desc } from 'drizzle-orm'
import { addLatestBlogToUsersReadingLists } from './users'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'


export const getBlogs = db.select().from(blogs);

async function addBlog() {

	db.insert(blogs).values({ title: title, author: author, url: url })
  
	const tableUpdate = addLatestBlogToUsersReadingLists()
	
	return
}
	
// note: "likes" field value is changed by clicking on a button, no number input field available in the form
export const addBlog = db.insert(blogs).values({ title: title, author: author, url: url })

async function getBlogById(id: string) {

  if (!id) throw new Error("Blog ID is required!");
  
  const numericId = Number(id);
  
  const blog = await db.query.blogs.findFirst({
		where: (blogs, { eq }) => eq(blogs.id, numericId),
  });
  
  return blog
}

async function sortBlogsByLikesDesc() {

  const sortedBlogs = await db.select().from(blogs).orderBy(desc(blog.likes))
  
  return sortedBlogs
}

export const incrementLikesByOne = async (formData: FormData) => {
	
	const blogId = Number(formData.get("id"))
	
	const blog = blogs.find((blog) => blog.id === blogId)
	
	if (blog) {
		blog.likes++
	}
	
	revalidatePath("/blogs")
	
	redirect("/blogs")
}


export async function getBlogAuthorName(id: string) {
	
	if (!id) throw new Error("Blog ID is required!");
  
	const numericId = Number(id);	
	
	const [result] = await db
		.select({ authorName: users.name })
		.from(users)
		.where(
			eq(users.id, numericId)
		)
		.limit(1);
			
	return result.authorName	
			
}
