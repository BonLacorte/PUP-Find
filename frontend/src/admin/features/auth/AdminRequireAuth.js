import { useLocation, Navigate, Outlet } from 'react-router-dom'
import useAdminAuth from '../../hooks/useAdminAuth'

const AdminRequireAuth = () => {
    const location = useLocation()
    const { isAdmin } = useAdminAuth()

    const content = (
        isAdmin
            ? <Outlet />
            : <Navigate to="/admin/login" state={{ from: location }} replace />
    )

    return content
}
export default AdminRequireAuth