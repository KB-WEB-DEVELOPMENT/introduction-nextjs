'use client'

import { useActionState } from "react"
import { createBlog } from "../../actions/blogs"

export default const NewBlog = () => {
	const [state, formAction] = useActionState(createBlog, { error: "" })

	return (
		<div>		
			<h2>Create a new blog</h2>
			<form action={formAction}>
				<div>
					<label>
						Blog title
						<input type="text" name="title" />
					</label>
				</div>
				<div>
					<label>
						Blog author
						<input type="text" name="author" />
					</label>
				</div>
				<div>
					<label>
						Blog url
						<input type="url" name="url" />
					</label>
				</div>
				<button type="submit">create</button>
				{state.error && <p style={{ color: "red" }}>{state.error}</p>}
			</form>
		</div>
	)
}
		
