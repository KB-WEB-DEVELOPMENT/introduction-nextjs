import Link from "next/link"
import { registerUser } from "../../actions/users"

export default function RegisterPage() {
	return (
		<div>
			<h2>Register</h2>
			<form action={registerUser}>
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
						<input type="password" name="password" required />
					</label>
				</div>
				<button type="submit">Register</button>
			</form>
		</div>
	)
}