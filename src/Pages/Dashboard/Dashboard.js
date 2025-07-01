import { Outlet } from "react-router-dom";
import SideBar from "../../Components/Dashboard/SideBar";
import { useContext } from "react";
import { User } from "../../Context/UserContext";
import NotFound from "../../Components/NotFound/NotFound";

export default function Dashboard(){
  const context = useContext(User)
  const userRole = context.user.role 
    return(
       userRole==="admin" ? <div className="flex h-full md:h-screen bg-gray-100">
        <SideBar />
        <Outlet />
      </div> : <NotFound />
    )
}