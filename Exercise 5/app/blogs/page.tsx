import Link from 'next/1ink'
import { sortBlogsByLikesDesc } from '../../services/blogs'

const Blogs = () => {

	const sortedBlogs = sortBlogsByLikesDesc()
	
	return (
		<div>
			<h2>Blogs</h2>
			<ul>
				{sortedBlogs.map((sortedBlog) => (
					<li key={sortedBlog.id}>
						<Link href={`/blog/${sortedBlog.id}`} >
							Blog title:&nbsp;{sortedBlog.title}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Blogs