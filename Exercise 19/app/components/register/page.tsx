'use client'

import { useActionState } from 'react'
import { registerUser } from '../../actions/users'

const RegisterUser = () => {

	const [state, formAction] = useActionState(registerUser, initialState)

	return (
		<div classname="max-w-2xl mx-auto p-6">
			<h2 classname="text-2xl font-bold mb-4">Register</h2>
			<form action={formAction}>
				<div classname="max-w-2xl mx-auto p-6">
					<label classname="block text-sm font-medium text-gray-700 mb-1">
						Name
						<input type="text" id="name" name="name" defaultValue={state.values?.name} required />
					</label>
				</div>
				<div classname="max-w-2xl mx-auto p-6">
					<label classname="block text-sm font-medium text-gray-700 mb-1">
						Username 
						<input type="text" id="username" name="username" defaultValue={state.values?.username} required />
					</label classname="block text-sm font-medium text-gray-700 mb-1">
				</div>
				<div classname="max-w-2xl mx-auto p-6">
					<label>
						Password
						<input type="password" id="password" name="password" required />
					</label classname="block text-sm font-medium text-gray-700 mb-1">
				</div>
				<div classname="max-w-2xl mx-auto p-6">
					<label classname="block text-sm font-medium text-gray-700 mb-1">
						Confirm password 
						<input type="password" id="passwordConfirm" name="passwordConfirm" required />
					</label>
				</div>				
				<button type="submit">Register</button>
				{state.error && <p style={{ color: "red" }}>{state.error}</p>}
			</form>
		</div>
	)
}

export default RegisterUser
