import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation()
    const { isAdmin } = useAuth()

    const content = (
        isAdmin
            ? <Navigate to="/login" state={{ from: location }} replace />
            : <Outlet /> 
    )

    return content
}
export default RequireAuth