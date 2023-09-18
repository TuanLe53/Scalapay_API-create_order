import { createContext, useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom'
import ServerURL from '../api/ServerURL';

const AuthContext = createContext()
export default AuthContext;

export const AuthProvider = ({children}) => {
    let [accessToken, setAccessToken] = useState(()=> localStorage.getItem('accessToken') ? JSON.parse(localStorage.getItem('accessToken')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('accessToken') ? jwt_decode(localStorage.getItem('accessToken')) : null)
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const logoutUser = () => {
        fetch(ServerURL.AUTH_URL + "logout", {
            method: "POST",
            credentials: "include",
        })
        setAccessToken(null)
        setUser(null)
        localStorage.removeItem("accessToken")
        navigate("/")
    }

    const updateToken = async () => {
        let res = await fetch(ServerURL.AUTH_URL + "refresh", {
            method: "GET",
            headers:{
                'Content-Type':'application/json'
            },
            credentials: 'include',
        })

        if (res.status === 200) {
            let data = await res.json()
            setAccessToken(data)
            setUser(jwt_decode(data["accessToken"]))
            localStorage.setItem("accessToken", JSON.stringify(data))
        } else {
            logoutUser()
        }

        if (loading) {
            setLoading(false)
        }
    }

    let contextData = {
        user:user,
        accessToken:accessToken,
        logoutUser: logoutUser,
        setAccessToken: setAccessToken,
        setUser: setUser,
    }

    useEffect(() => {
        if (loading) {
            updateToken()
        }
        let fourMinutes = 1000 * 60 * 4
        let interval = setInterval(() => {
            if (accessToken) {
                updateToken()
            }
        }, fourMinutes)
        return ()=> clearInterval(interval)
    }, [accessToken, loading])

    return(
        <AuthContext.Provider value={contextData} >
            {loading ? null : children}
        </AuthContext.Provider>
    )
}