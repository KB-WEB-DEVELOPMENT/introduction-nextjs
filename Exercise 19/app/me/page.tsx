"use client"

import { useActionState, useEffect } from "react
import { useRouter } from "next/navigation"
import { checkUserHasToken,  generateUserToken } from "../../services/users"
import { getCurrentUser } from "../../services/session"
import { useNotification } from "../components/NotificationContext"	

const Me = async () => {

	const [state, formAction] = useActionState(generateUserToken)
	
	const { showNotification } = useNotification()
	
	const router = useRouter()

	useEffect(() => {
		if (state.success) {
			showNotification("New token generated!")
			router.push("/me")
		}
	}, [state, showNotification, router])
	
	
	const user = await getCurrentUser()
	
	const userHasToken = await checkUserHasToken()

	return (
		<div classname="max-w-2xl mx-auto p-6">		
			<h2 classname="text-2xl font-bold mb-4">My Profile</h2>		
			<p classname="text-base text-slate-700 text-lg leading-relaxed mb-4">
				Name:&nbsp;{ user.name }
			</p>
			<p classname="text-base text-slate-700 text-lg leading-relaxed mb-4">
				Username:&nbsp;{ user.username }
			</p> 						
			<h2 classname="text-2xl font-bold mb-4">API Token</h2>		
			{userHasToken ? (
				<h3 classname="text-2xl font-bold mb-4">Current token:</h3>
				<p classname="text-base text-slate-700 text-lg leading-relaxed mb-4">
					{ user.token }
				</p>
			) : (
				<p classname="text-base text-slate-700 text-lg leading-relaxed mb-4">
					No token generated yet.
				</p>
			)}
			<div className="max-w-2xl mx-auto p-6">
				<form action={formAction} className="mt-4">
					<button type="submit" 
					        className="bg-gray-600
 							           hover:bg-gray-500
 									   px-3 py-1
									   rounded
									   text-xl"
					>
						Generate New Token
					</button>
				</form>
			</div>
		</div>
	)

}
