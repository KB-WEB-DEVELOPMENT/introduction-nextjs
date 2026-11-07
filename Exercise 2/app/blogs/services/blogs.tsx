const blogs = [

	{ id: 1, title: "Blog 1 title", author: "John Doe 1" , url: "http://www.blog1.com", likes: 127 },
	{ id: 2, title: "Blog 2 title", author: "John Doe 2" , url: "http://www.blog2.com", likes: 83 },
	{ id: 3, title: "Blog 3 title", author: "John Doe 3" , url: "http://www.blog3.com", likes: 29 },
	{ id: 4, title: "Blog 4 title", author: "John Doe 4" , url: "http://www.blog4.com", likes: 11 },

]

let nextId = 5

export const getBlogs = () => {
	return blogs
}

// note: likes field not part of this exercise
export const addBlog = (title: string, author: string, url:string) => {
	blogs.push({ id: nextId++, title, author, url}) 
}