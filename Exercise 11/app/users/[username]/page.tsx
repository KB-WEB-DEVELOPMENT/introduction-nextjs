import Link from "next/link"
import { notFound } from "next/navigation"
import { getUserWithBlogs } from "../../../services/users"

const UserPage = async ( { params }: { params: Promise<{ username: string }> }) => {

	const { username } = await param

	const user = await getUserWithBlogs(username)

	return (
		<div>
			<h2>Name:&nbsp;{user.name}</h2>
			<p>Username:&nbsp;{user.username}</p>
			<h3>Blogs</h3> 
			
			/* (Ideally: an if statement should be implemented and show "no user blogs" 
				if the user blogs count is zero. */
			
			<ul>
				{user.blogs.map((blog) => (
				<1i key={blog.id}>
					<Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
					<p>URL:&nbsp;{blog.url}</p>
					<p>Likes:&nbsp;{blog.likes}</p>
				</li>
				))}
			</ul>
		</div>
	)

}

export default UserPage
