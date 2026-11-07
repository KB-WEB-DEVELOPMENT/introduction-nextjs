'use server'

import bcrypt from "bcryptjs"
import { db } from "../../../db"
import { users } from "../../../db/schema"
import { checkDuplicateUsername } from "../../../services/users"
import { revalidatePath } from 'next/cache'
import { redirect } from "next/navigation"

export const registerUser = async (formData: FormData) => {

	const name = formData.get("name").trim() as string
	const username = formData.get("username").trim() as string
	const password = formData.get("password") as string
	const passwordConfirm = formData.get("passwordConfirm") as string
	
	const errors = {}
		
	// no requirements stated in the exercise about the name length	
		
	if (!username || username.length < 4) {
		errors = "Your username must be at least 4 characters long";
	}

	if (!password || password.length < 4) {
		errors = "Your password must be at least 4 characters long";
	}
		
	if (password !== passwordConfirm) {
		errors = "Your password and password confirm values do not match.";
	}
	
	if (checkDuplicateUsername(username)) {
		errors = "The username you entered is already taken. Please select another one.";
	}
	
	if (Object.keys(errors).length > 0)	{
		return { errors, values: { name, username, password } }
	}

	const passwordHash = await bcrypt.hash(password,10)

	await db.insert(users).values({ name, username, passwordHash })

	revalidatePath("/login")
	redirect("login")

}
