import React, { useEffect, useState } from 'react'
import AdminNewFoundForm from './AdminNewFoundForm';
import useAdminAuth from '../../hooks/useAdminAuth';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { server } from '../../../server';
import PulseLoader from 'react-spinners/PulseLoader';

const AdminNewFoundLoad = () => {
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

    const content = users ? <AdminNewFoundForm users={users}/> : 
        <div className="w-full h-screen flex items-center justify-center">
            <div className="flex justify-center">
                <PulseLoader  color={"#000"} />
            </div>
        </div>
    return content
}

export default AdminNewFoundLoad