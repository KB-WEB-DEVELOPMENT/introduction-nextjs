import { addBlog } from '../../../services/blogs/page'
import { addLatestBlogToReadingList } from '../../../services/users/page'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]' // need to add this
import { revalidatePath } from 'next/cache' 


export const createBlog = async (
	prevState: { error: string, success?: boolean },
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
		
			return  {
				errors: "The blog title must be at least 5 characters long.";
				success: false,
			}
		}
		
		if (!author || author.length < 5) {

			return  {
				errors: "The blog author name must be at least 5 characters long.";
				success: false,
			}
		}

		if (!url || url.length < 5) {

			return  {
				errors: "The blog URL must contain at the very least 5 characters.";
				success: false,
			}
		}
		
		if (Object.keys(errors).length > 0)	{
			return { errors, values: { title, author, url } }
		}
		
		await addBlog(title, author, url)
		
		await addLatestBlogToReadingList()
		
		revalidatePath("/blogs")
		
		return { error: "", success: true }
}
