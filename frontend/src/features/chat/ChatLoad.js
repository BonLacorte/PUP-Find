import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { server } from '../../server';

const ChatLoad = () => {

    const { selectedReport, setSelectedReport } = ChatState();

    const { accessToken } = useAuth();
    const { founderId, setFounderId } = useState()
    const { reportId, setReportId } = useState()

    const consoleLogs = () => {
        console.log(`${selectedReport} from chatLoad`)
    }
    
    useEffect(() => {
        fetchLostItem();
    }, []);

    const fetchLostItem = async (selectedReport) => {
        try {
            const config = {
                headers: {
                    token: `Bearer ${accessToken}`,
                },
            };
            // setReportId(selectedReport)
            const { data } = await axios.get(`${server}/lostitems/${selectedReport}`, config);
    
            setFounderId(data.founder._id)
            // console.log(`${reportId} - reportId on ChatLoad`)
            console.log(`${founderId} - founderId on ChatLoad`)
            
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={consoleLogs}>Go</button>
        </>
    )
}

export default ChatLoad