import Link from "next/link"
import { notFound } from "next/navigation"
import { getCurrentReaderBlogReadStatus } from "../../../../services/users"
import { getBlogById , getBlogAuthorName } from "../../../../services/blogs"

/*
- The two buttons on the page (blog likes count increase by one, current user blog read status change) which 
should be implemented through two different form actions are not implemented here because it is not asked in this 
exercise.
*/

const BlogPage = async ( { params }: { params: Promise<{ id: string }> ]) => {

	const { id } = await param
	
	const blogId = id

	const blog =  await getBlogById(blogId)
	const blogAuthorName = await getBlogAuthorName(blogId)
	const readStatus = await getCurrentReaderBlogReadStatus(blogId)

	return (
		<div classname="max-w-2xl flex mx-auto p-6">
			<p class="text-base text-slate-700 text-lg font-extrabold leading-relaxed mb-4">{blog.title}</p>
			<p class="text-base text-slate-700 leading-relaxed mb-4">by &nbsp;{blogAuthorName}</p>									
			<div class="flex gap-4">
				<p class="text-base text-slate-700 leading-relaxed mb-4">
					likes:&nbsp;{blog.likes}
				</p>
				  <div class="flex items-center gap-2 shrink-0">
					/*
						Note: I do not implement a form action to increase the likes counter 
						for this blog as this is not required in the exercise.
					*/					
					<button type="submit" class="px-4 py-2 bg-blue-600 text-white">
					  like
					</button>
					{!readStatus ? (
						/*
							Note: I do not implement a form action to add the blog to the user 
						    reading list as this is not required in the exercise.
						*/
						<button type="submit" class="px-4 py-2 bg-green-600 text-white">
							add to reading list
						</button>
						) : (
					)}
				  </div>
			</div>		
			<p class="text-base text-slate-700 leading-relaxed mb-4">{blog.url}</p>			
		</div>
	)

}

