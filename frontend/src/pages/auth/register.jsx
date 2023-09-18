import { useState } from "react"
import ServerURL from "../../api/ServerURL"
import { useNavigate } from 'react-router-dom'

export default function Register() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password_1, setPassword_1] = useState("")
    const [ password_2, setPassword_2 ] = useState("")
    
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        //check password
        if (password_1 !== password_2) {
            return alert("Password do  not match")
        }
        let user = {
            username: username,
            email: email,
            password: password_1
        }

        let res = await fetch(ServerURL.AUTH_URL + "register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        })
        let data = await res.json()
        if (res.status === 201) {
            alert("User created. Please login")
            navigate("/login")
        } else {
            alert(data.error)
        }
    }

    return (
        <div className="auth-page">
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <label htmlFor="username">Username</label><br />
                <input type="text" id="username" placeholder="Enter your username" value={username} onChange={e => setUsername(e.target.value)} required/><br />
                <label htmlFor="email">Email</label><br />
                <input type="email" id="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required/><br />
                <label htmlFor="password-1">Password</label><br />
                <input type="password" id="password-1" placeholder="Enter your password" value={password_1} onChange={e => setPassword_1(e.target.value)} required/><br />
                <label htmlFor="password-2">Confirm password</label><br />
                <input type="password" id="password-2" placeholder="Enter your password again" value={password_2} onChange={e => setPassword_2(e.target.value)} required/><br />
                <div className="btn-wrapper">
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    )
}