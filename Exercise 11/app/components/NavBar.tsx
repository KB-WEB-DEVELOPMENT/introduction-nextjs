'use client'

import { useSession, signOut } from "next-auth/react"

export default function NavBar() {

	const { data: session } = useSession()

	return (
		<nav>
			<a href="/">home</a>
			{" | "}
			<a href="/blogs">Blogs</a>
			{" | "}
			<a href="/users">users</a>
			{" | "}
				{session ? (
					<>
						<a href="/blogs/new">create new blog</a>
						{" | "}
						<em>{session.user?.name} logged in</em>{" "}
						<button onClick={() => signOut()}>logout</button>
					</>
					) : (
						<a href="/login">login</a>
					)
				}
	   </nav>
	 )
}
		