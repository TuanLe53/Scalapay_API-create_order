import { useContext, useState } from "react"
import jwt_decode from "jwt-decode";
import ServerURL from "../../api/ServerURL"
import AuthContext from "../../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import "./auth.css"

export default function Login() {
    const [email, setEmail ] = useState("")
    const [password, setPassword ] = useState("")
    
    const {setUser, setAccessToken} = useContext(AuthContext)

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        const res = await fetch(ServerURL.AUTH_URL + "login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        })
        const data = await res.json()
        if (res.status === 200) {
            setAccessToken(data)
            setUser(jwt_decode(data["accessToken"]))
            localStorage.setItem("accessToken", JSON.stringify(data))
            navigate("/")
        } else {
            alert(data.error)
        }
    }


    return (
        <div className="auth-page">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <label htmlFor="email">Email</label><br />
                <input type="email" id="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required /><br />
                <label htmlFor="password">Password</label><br />
                <input type="password" id="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required /><br />
                <div className="btn-wrapper">
                    <button type="submit">Login</button>
                </div>
                <Link to={"/register"}>Register?</Link>
            </form>
        </div>
    )
}