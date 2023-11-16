import axios from 'axios';
import React, { useEffect, useState } from 'react'
import AdminEditUserForm from './AdminEditUserForm';
import useAdminAuth from '../../hooks/useAdminAuth';
import { useParams } from 'react-router-dom';
import { server } from '../../../server';

const AdminEditUserLoad = () => {
    const { userId, name, accessToken } = useAdminAuth()

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState()

    const fetchUserInfo = async () => {
        try {
            const config = {
            headers: {
                token: `Bearer ${accessToken}`,
            },
        };

        const { data } = await axios.get(`${server}/user/${id}`, config);
        
        console.log(`load`)
        console.log(data)
        setUser(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUserInfo()
    }, []);

    const content = user ? <AdminEditUserForm user={user}/> : <p>Loading...</p>
    return content
}

export default AdminEditUserLoad