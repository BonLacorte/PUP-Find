import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useAdminAuth from '../../hooks/useAdminAuth';
import axios from 'axios';
import AdminNewMissingForm from './AdminNewMissingForm';
import { server } from '../../../server';

const AdminNewMissingLoad = () => {
    const { userId, name, accessToken } = useAdminAuth()

    const { id } = useParams();

    const [users, setUsers] = useState()

    const fetchUsers = async () => {
        try {
            const config = {
            headers: {
                token: `Bearer ${accessToken}`,
            },
        };

        const { data } = await axios.get(`${server}/user/`, config);
        
        console.log(`load`)
        console.log(data)
        setUsers(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, []);

    const content = users ? <AdminNewMissingForm users={users}/> : <p>Loading...</p>
    return content
}

export default AdminNewMissingLoad