import { Outlet, Link } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from "./adminAuthApiSlice"
import useAdminPersist from "../../hooks/useAdminPersist"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "./adminAuthSlice"

const AdminPersistLogin = () => {

    const [adminPersist] = useAdminPersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()


    useEffect(() => {

        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // React 18 Strict Mode

            const verifyRefreshToken = async () => {
                console.log('verifying refresh token')
                try {
                    //const response = 
                    await refresh()
                    //const { accessToken } = response.data
                    setTrueSuccess(true)
                }
                catch (err) {
                    console.error(err)
                }
            }

            if (!token && adminPersist) verifyRefreshToken()
        }

        return () => effectRan.current = true

        // eslint-disable-next-line
    }, [])


    let content
    if (!adminPersist) { // persist: no
        console.log('no persist')
        content = <Outlet />
    } else if (isLoading) { //persist: yes, token: no
        console.log('loading')
        content = <p>Loading...</p>
    } else if (isError) { //persist: yes, token: no
        console.log('error')
        content = (
            <p className='errmsg'>
                {error?.data?.message}
                <Link to="/admin/login">Please login again</Link>.
            </p>
        )
    } else if (isSuccess && trueSuccess) { //persist: yes, token: yes
        console.log('success')
        content = <Outlet />
    } else if (token && isUninitialized) { //persist: yes, token: yes
        console.log('token and uninit')
        console.log(isUninitialized)
        content = <Outlet />
    }

    return content
}
export default AdminPersistLogin