import axios from 'axios';
import React, { useEffect, useState } from 'react'
import AdminEditUserForm from './AdminEditUserForm';
import useAdminAuth from '../../hooks/useAdminAuth';
import { useParams } from 'react-router-dom';
import { server } from '../../../server';
import PulseLoader from 'react-spinners/PulseLoader';

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

    const content = user ? <AdminEditUserForm user={user}/> : 
        <div className="w-full h-screen flex items-center justify-center">
            <div className="flex justify-center">
                <PulseLoader  color={"#000"} />
            </div>
        </div>
    return content
}

export default AdminEditUserLoad