'use client'

import { useActionState } from "react"
import { createBlog } from "../../actions/blogs"

const NewBlog = () => {

	const [state, formAction] = useActionState(createBlog, initialState)

	return (
		<div>		
			<h2>Create a new blog</h2>
			<form action={formAction}>
				<div>
					<label>
						Blog title
						<input type="text" id="title" name="title" defaultValue={state.values?.title} />
					</label>
				</div>
				<div>
					<label>
						Blog author
						<input type="text" id="author" name="author" defaultValue={state.values?.author} />
					</label>
				</div>
				<div>
					<label>
						Blog url
						<input type="url" id="url" name="url" defaultValue={state.values?.url} />
					</label>
				</div>
				<button type="submit">create</button>
				{state.error && <p style={{ color: "red" }}>{state.error}</p>}
			</form>
		</div>
	)
}
		