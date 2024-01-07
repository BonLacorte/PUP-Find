import React, { useEffect, useState } from 'react'
import useAdminAuth from '../../hooks/useAdminAuth';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import AdminClaimedReceipt from './AdminClaimedReceipt';
import { server } from '../../../server';
import PulseLoader from 'react-spinners/PulseLoader';

const AdminClaimedReciptLoad = () => {

    const { userId, name, accessToken } = useAdminAuth()
    const location = useLocation();
    const reports  = location.state // Provide a default value if location.state is null

    const [claimedReport, setClaimedReport] = useState()

    // console.log(`reports`, reports)
    // console.log(`reports.missingReport`, reports.missingReport)
    // console.log(`reports.foundReport `, reports.foundReport )

    const fetchClaimedReportInfo = async () => {
        try {
            const config = {
            headers: {
                token: `Bearer ${accessToken}`,
            },
        };

        const { data } = await axios.get(`${server}/claimedReport/${reports.missingReport}/${reports.foundReport}`, config);
        
        // console.log(`fetchClaimedReportInfo`, data)
        setClaimedReport(data)
        } catch (error) {
            // console.log(error)
        }
    }

    useEffect(() => {
        fetchClaimedReportInfo()
        // // console.log("I am at admin claimed receipt")
    }, []);

    
    const content = reports && reports.missingReport && reports.foundReport ? 
        claimedReport ? 
            <AdminClaimedReceipt claimedReport={claimedReport}/> 
            : 
                <div className="w-full h-screen flex items-center justify-center">
                    <div className="flex justify-center">
                        <PulseLoader  color={"#000"} />
                    </div>
                </div>
        :
        <div>
            <p>Data not available. Please navigate through the appropriate route.</p>
        </div> 

    return content
}
export default AdminClaimedReciptLoad