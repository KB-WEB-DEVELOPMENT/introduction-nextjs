import { db } from '../../db';
import { users, blogs } from '../../db/schema';
import { eq, sql } from "drizzle-orm";
import { desc } from 'drizzle-orm';
import { revalidatePath } from "next/cache";

export const getBlogs = db.select().from(blogs);
	
// note: "likes" field value changed by clicking on a button, no number input field available in the form
export const addBlog = db.insert(blogs).values({ title: title, author: author, url: url });

async function getBlogById(id: number) {
  const blog = await db.query.blogs.findFirst({
	where: (blogs, { eq }) => eq(blog.id, id),
  });
  
  return blog;
}

async function sortBlogsByLikesDesc() {
  return await db.select().from(blogs).orderBy(desc(blogs.likes));
}

export const incrementLikesByOne = async (formData: FormData) => {
	
	const id = Number(formData.get("id"))
	
	const blog = blogs.find((blog) => blog.id === id)
	
	if (blog) {
		blog.likes++
	}
	
	revalidatePath("/blogs")
	
	redirect("/blogs")
}


export async function incrementLikesByOne(id: number) {

	if (!id) throw new Error("Blog ID is required!");
	
	  try {
			await db
				.update(blogs)
				.set({
					likes: sql`${blog.likes} + 1`,
				})
				.where(eq(blog.id, id));		
	  }

	revalidatePath("/blogs")	
	
	redirect("/blogs")
}










