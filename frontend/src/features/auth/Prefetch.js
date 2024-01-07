import { store } from '../../app/store';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { userApiSlice } from '../chat/userApiSlice';

const Prefetch = () => {

    useEffect(() => {
        // store.dispatch(adminUsersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
        // console.log('subscribing')
        const getUser = store.dispatch(userApiSlice.endpoints.getUser.initiate())
        return () => {
            // console.log('unsubscribing')
            getUser.unsubscribe()
        }
    }, [])

    return <Outlet />
}

export default Prefetch