import { Outlet, Link } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from "./adminAuthApiSlice"
import useAdminPersist from "../../hooks/useAdminPersist"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "./adminAuthSlice"
import PulseLoader from "react-spinners/PulseLoader"

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
        content = 
            <div className="w-full h-screen flex items-center justify-center">
                <div className="flex justify-center">
                    <PulseLoader  color={"#000"} />
                </div>
            </div>
    } else if (isError) { //persist: yes, token: no
        console.log('error')
        content = (
            <div className="w-full h-screen flex items-center justify-center">
                <p className='flex flex-col items-center justify-center errmsg text-lg font-medium'>
                    {`${error?.data?.message}`}
                    <Link to="/admin/login" className="text-white border bg-primaryColor rounded-lg p-2">Please login again</Link>
                </p>
            </div>
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