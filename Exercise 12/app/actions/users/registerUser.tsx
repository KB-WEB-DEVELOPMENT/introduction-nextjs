'use server';

import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { db } from "../../../db"
import { users } from "../../../db/schema"

export const registerUser = async (formData: FormData) => {

	const username = formData.get("username").trim()
	const name = formData.get("name").trim()
	const password = formData.get("password")

	const passwordHash = await bcrypt.hash(password,10)

	await db.insert(users).values({ username, name, passwordHash })

	redirect("/login")

}