import { useSelector } from 'react-redux'
// import { selectCurrentToken } from "../features/auth/authSlice"
import { selectCurrentToken } from "../../admin/features/auth/adminAuthSlice"
import jwtDecode from 'jwt-decode'

const useAdminAuth = () => {
    const token = useSelector(selectCurrentToken)

    if (token) {
        const decoded = jwtDecode(token)
        const userInfo = decoded.UserInfo
        const { _id, name, email, isAdmin, pic, uid } = decoded.UserInfo
        return { userId: _id, name, email, isAdmin, pic, userInfo, accessToken: token, uid }
    }

    return { userId: '', name: '', email: '', isAdmin: '', pic: '', accessToken: ''}
}
export default useAdminAuth