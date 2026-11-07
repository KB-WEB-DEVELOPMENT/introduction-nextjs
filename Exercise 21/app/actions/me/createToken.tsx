'use server'

import { generateUserToken } from '../../../services/users'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const createToken = async (formData: FormData) => {

	await generateUserToken()
	
	revalidatePath("/me")
	
	redirect("me")

}
