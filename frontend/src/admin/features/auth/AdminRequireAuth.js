import { useLocation, Navigate, Outlet } from 'react-router-dom'
import useAdminAuth from '../../hooks/useAdminAuth'

// const AdminRequireAuth = ({ allowedRoles }) => {
//     const location = useLocation()
//     const { isAdmin } = useAdminAuth()

//     const content = (
//         isAdmin.some(role => allowedRoles.includes(role))
//             ? <Outlet />
//             : <Navigate to="/admin/login" state={{ from: location }} replace />
//     )

//     return content
// }

const AdminRequireAuth = () => {
    const location = useLocation()
    const { isAdmin } = useAdminAuth()

    const content = (
        isAdmin
            ? <Outlet />
            : <Navigate to="/admin/login" state={{ from: location }} replace />
        // isAdmin === true
        //     ? <h1>isAdmin is true: {isAdmin}</h1>
        //     : <h1>isAdmin is false: {isAdmin}</h1>
    )

    return content
}

export default AdminRequireAuth