'use server'

import bcrypt from 'bcryptjs'
import { db } from '../../../db'
import { users } from '../../../db/schema'
import { redirect } from 'next/navigation'

export const registerUser = async (formData: FormData) => {

	const name = formData.get("name").trim()
	const username = formData.get("username").trim()
	const password = formData.get("password")

	const passwordHash = await bcrypt.hash(password,10)

	await db.insert(users).values({ name, username, passwordHash })

	redirect("/login")

}