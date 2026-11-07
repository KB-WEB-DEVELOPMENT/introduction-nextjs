import { db } from '../../db';
import { users, blogs } from '../../db/schema';
import { eq, sql } from "drizzle-orm";
import { desc } from 'drizzle-orm';
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';

export const getBlogs = db.select().from(blogs);
	
/* 
note: "likes" field value changed by clicking on a button, no number
input field available in the form
*/
export const addBlog = db.insert(blogs).values({ title: title, author: author, url: url });

export const getBlogById = (id: string) => {

  if (!id) throw new Error("Blog id is required!");  

  const { id } = await params;
 
  const numericId = Number(id);

  return blogs.find((blog) => blog.id === numericId)
}

async function sortBlogsByLikesDesc() {
  return await db.select().from(blogs).orderBy(desc(blog.likes));
}

export const incrementLikesByOne = async (formData: FormData) => {
	
	const numericId = Number(formData.get("id"))
	
	const blog = blogs.find((blog) => blog.id === numericId)
	
	if (blog) {
		blog.likes++
	}
	
	revalidatePath("/blogs")
	
	redirect("/blogs")
}