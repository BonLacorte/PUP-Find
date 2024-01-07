import { store } from '../../../app/store';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { adminUsersApiSlice } from '../user/adminUsersApiSlice';
import { adminOrdersApiSlice } from '../orders/adminOrdersApiSlice';
import { adminProductsApiSlice } from '../products/adminProductsApiSlice';

const AdminPrefetch = () => {

    useEffect(() => {
        // store.dispatch(adminUsersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
        // console.log('subscribing')
        const users = store.dispatch(adminUsersApiSlice.endpoints.getUsers.initiate())
        const orders = store.dispatch(adminOrdersApiSlice.endpoints.getOrders.initiate())
        const getProducts = store.dispatch(adminProductsApiSlice.endpoints.getProducts.initiate())
        return () => {
            // console.log('unsubscribing')
            users.unsubscribe()
            orders.unsubscribe()
            getProducts.unsubscribe()
        }
    }, [])

    return <Outlet />
}

export default AdminPrefetch