import { db } from '../../db';
import { blogs } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const getBlogs = db.select().from(blogs);
	
/* note: "likes" field value changed by clicking on a button, no number input field available 
in the form
*/
export const addBlog = db.insert(blogs).values({ title: title, author: author, url: url });

async function getBlogById(id: string) {

  if (!id) throw new Error("Blog ID is required!");
  
  const numericId = Number(id);

  const blog = await db.query.blogs.findFirst({
	where: (blogs, { eq }) => eq(blogs.id, numericId),
  });
  
  return blog;
}

async function sortBlogsByLikesDesc() {
  return await db.select().from(blogs).orderBy(desc(blogs.likes));
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