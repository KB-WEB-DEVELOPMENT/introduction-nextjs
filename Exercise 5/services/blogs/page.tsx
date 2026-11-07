'use server';

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const blogs = [

	{ id: 1, title: "Blog 1 title", author: "John Doe 1" , url: "http://www.blog1.com", likes: 127 },
	{ id: 2, title: "Blog 2 title", author: "John Doe 2" , url: "http://www.blog2.com", likes: 83 },
	{ id: 3, title: "Blog 3 title", author: "John Doe 3" , url: "http://www.blog3.com", likes: 29 },
	{ id: 4, title: "Blog 4 title", author: "John Doe 4" , url: "http://www.blog4.com", likes: 11 },

]

let nextId = 5

export const getBlogs = () => {
	return blogs
}

// note: "likes" field not a required field in form in this exercise
export const addBlog = (title: string, author: string, url:string) => {
	blogs.push({ id: nextId++, title, author, url}) 
}

export const getBlogById = (id: string) => {

  const { id } = await params;
 
  const numericId = Number(id);

  return blogs.find((blog) => blog.id === numericId)
  
}

export const sortBlogsByLikesDesc = () => {
	
	const tempBlogsArray = [...blogs]; 
	
	sortedBlogs = tempBlogsArray.sort((a, b) => b.likes - a.likes)
	
	return sortedBlogs
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