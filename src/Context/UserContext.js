import { createContext, useState } from "react";

export const User = createContext({})

export default function UserProvider({ children }) {
     const [user,setUser] = useState({
        id:"",
        role:"",
     })

    return (
        <User.Provider value={{ user, setUser }}>
            {children}
        </User.Provider>
    );
}
