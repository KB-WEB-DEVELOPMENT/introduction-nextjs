'use server'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/options' // need to add this 
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const createBlog = async (
	prevState: { error: string },
	formData: FormData,
) => {
	
	const session = await getServerSession(authOptions)
	
	if (!session) {
		redirect("/login")
	}
	
	const title = formData.get("title") as string
	const author = formData.get("author") as string
	const url = formData.get("url") as string
	
	if (!title || title.length < 5) {
		return { error: "Blog title must be at least 5 characters long" }
	}
	
	if (!author || author.length < 5) {
		return { error: "Blog author name must be at least 5 characters long" }
	}

	if (!url || url.length < 5) {
		return { error: "Blog url must be at least 5 characters long" }
	}
	
	await addBlog(title, author, url)
	
	revalidatePath("/blogs")
	
	redirect("/blogs")
}