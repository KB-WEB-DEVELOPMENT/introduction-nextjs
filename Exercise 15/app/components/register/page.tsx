'use client'

import { useActionState } from "react"
import { registerUser } from "../../actions/users"

const RegisterUser = () => {

	const [state, formAction] = useActionState(registerUser, initialState)

	return (
		<div>
			<h2>Register</h2>
			<form action={formAction}>
				<div>
					<label>
						Name
						<input type="text" id="name" name="name" defaultValue={state.values?.name} required />
					</label>
				</div>
				<div>
					<label>
						Username 
						<input type="text" id="username" name="username" defaultValue={state.values?.username} required />
					</label>
				</div>
				<div>
					<label>
						Password
						<input type="password" id="password" name="password" required />
					</label>
				</div>
				<div>
					<label>
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