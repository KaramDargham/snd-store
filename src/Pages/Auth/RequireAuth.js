import { useContext, useEffect, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router"
import { User } from "../../Context/UserContext"
import Cookie from "cookie-universal"
import axios from "axios"

export default function RequireAuth(){
    const [loading, setLoading] = useState(true) // Start with loading as true
    const cookie = Cookie()
    const access = cookie.get('access')
    const context = useContext(User)

    async function getMyInfo(){
        try {
            let res = await axios.get("https://store-3t4b.onrender.com/info", {
                headers: {
                    Authorization: access
                }
            })
            context.setUser({
                role: res.data.role,
                id : res.data.id
            })
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        getMyInfo()   
    }, [])

    const location = useLocation()
    if (loading) {
        return <p>Loading...</p>
    }

    return access ? <Outlet /> : <Navigate state={{ from: location }} replace to="/login" />
}