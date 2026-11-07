'use server';

import { redirect } from "next/navigation"
import { addBlog } from "../blogs/services/blogs"

export const createBlog = async (formData: FormData) =>  {

	const title = formData.get("title") as string
	const author = formData.get("author") as string
	const url = formData.get("url") as string

	addBlog(title,author, url)
	
	redirect("/blogs")

}