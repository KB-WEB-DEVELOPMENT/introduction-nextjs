'use client'

import { useActionState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { createBlog ) from '../../actions/blogs'
import { useNotification } from '../components/NotificationContext'

const NewBlog = () => {

	const [state, formAction] = useActionState(createBlog, {
		error: "",
		success: false,
	})
	
	const { showNotification } = useNotification()
	const router = useRouter()

	useEffect(() => {
		if (state.success) {
			showNotification("new blog created")
			router.push("/blogs")
		}
	}, [state, showNotification, router])
	
	return (
		<div className="max-w-2xl mx-auto p-6">		
			<h2 className="text-2xl font-bold mb-4">Create a new blog</h2>
			<form action={formAction} className="mt-4">
				<div className="mt-4">
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Blog title
						<input type="text" id="title" name="title"  
								className="border border-gray-300 rounded-md" />
					</label>
				</div>
				<div className="mt-4">
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Blog author
						<input type="text" id="author" name="author"  
								className="border border-gray-300 rounded-md" />
					</label>
				</div>
				<div className="mt-4">
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Blog url
						<input type="url" id="url" name="url" 
								className="border border-gray-300 rounded-md" />
					</label>
				</div>
				<button type="submit" 
						className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm">
					create
				</button>
				{state.error && <p style={{ color: "red" }}>{state.error}</p>}
			</form>
		</div>
	)
}

export default NewBlog
