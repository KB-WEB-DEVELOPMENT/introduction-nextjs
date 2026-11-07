import Link from "next/link"

export default function RootLayout({
	children,
}:{
	children: React.ReactNode
})	{

	return (
		<html lang="eng">
			<body>
				<nav>
					<Link href="/">home</Link>
					{" | "}
					<Link href="/users">users</Link>
					{" | "}
					<Link href="/blogs">blogs</Link>
					{" | "}
					<Link href="/blogs/new">create new blog</Link>					
				</nav>
				{children}
			</body>
		</html>
	)
}