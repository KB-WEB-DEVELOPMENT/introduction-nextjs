'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { generateUserToken } from "../../../services/users"

export const createToken = async (formData: FormData) => {

	await generateUserToken()
	
	revalidatePath("/me")
	
	redirect("/me")

}