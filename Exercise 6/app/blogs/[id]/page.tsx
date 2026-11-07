'use client'; 

import { notFound } from "next/navigation"
import { getBlogById, incrementLikesByOne } from "../../services/blogs"

const BlogPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	
	const { id } = await params
	
	const blog = getBlogById(id)
	
	if (!blog) {
		notFound()
	}
	
	return (
		<div>
			<h2>{blog.title}</h2>
			<p>Author:&nbsp;{blog.author}</p>
			<p>URL:&nbsp;{blog.url}</p>
			<div style={{ display: 'block' }}>
				<p style={{ display: 'inline-block', marginRight: '10px' }}>
					Likes:&nbsp;{blog.likes}
				</p>
				<form action={incrementLikesByOne}>
					<input type="hidden" name="id" value={blog.id} />
					<button style={{ display: 'inline-block' }}>LIKE</button>
				</form>
			</div>
		</div>
	)

}
	
export default BlogPage