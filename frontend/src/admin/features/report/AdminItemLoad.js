import React, { useEffect, useState } from 'react'
import AdminItemPage from './AdminItemPage';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useAdminAuth from '../../hooks/useAdminAuth';
import { server } from '../../../server';
import PulseLoader from 'react-spinners/PulseLoader';

const AdminItemLoad = () => {
    const { userId, name, accessToken } = useAdminAuth()

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState()

    const fetchReportInfo = async () => {
        try {
            const config = {
            headers: {
                token: `Bearer ${accessToken}`,
            },
        };

        const { data } = await axios.get(`${server}/report/${id}`, config);
        
        console.log(`load`)
        console.log(data)
        setReport(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchReportInfo()
    }, []);

    const content = report ? <AdminItemPage report={report}/> : 
        <div className="w-full h-screen flex items-center justify-center">
            <div className="flex justify-center">
                <PulseLoader  color={"#000"} />
            </div>
        </div>
    return content
}

export default AdminItemLoad