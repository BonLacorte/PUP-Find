import React, { useEffect, useState } from 'react'
import ChatList from './ChatList';
import ChatScreen from './ChatScreen';
import ChatInfo from './ChatInfo';
import { ChatState } from '../../context/ChatProvider';
import useAuth from '../../hooks/useAuth';
import PulseLoader from 'react-spinners/PulseLoader';
import axios from 'axios';
import { server } from '../../server';

const ChatPage = () => {

    const { userId, accessToken } = useAuth();

    const [fetchAgain, setFetchAgain] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState()
    const [isSuccess, setIsSuccess] = useState(false)
    
    const {
        selectedChat,
        setSelectedChat,
        user,
        notification,
        setNotification,
        chats,
        setChats,
    } = ChatState();

    const fetchChats = async () => {
        try {
            const config = {
            headers: {
                token: `Bearer ${accessToken}`,
                },
            };

        const { data } = await axios.get(`${server}/chat`, config);
        
        await setChats(data);
        setIsLoading(false);
        setIsSuccess(true);
        // // console.log(`chats in ChatList`,{chats})
        
        } catch (err) {
            // console.log(err)
            setError(err)
            setIsLoading(false);
            setIsError(true);
        }
    }

    useEffect(() => {
        fetchChats()

        chats ? setIsSuccess(true) : setIsLoading(true)
    }, []);

    let content

    if (isLoading) {
        content = (
            <div className="bg-customBackground min-h-screen">
                <div className="flex justify-center">
                    <PulseLoader  color={"#FFF"} />
                </div>
            </div>
        )
    }

    if (isError) {
        content = (
            <div className="bg-customBackground min-h-screen">
                <div className="flex justify-center">
                    <p className="flex justify-center">{error}</p>
                </div>
            </div>
        )
    }

    if (isSuccess) {
        content = (
            <>
                {/* <div className="bg-customBackground"> */}
                <div className="mx-auto w-screen flex justify-start flex-col">
                    <div className='flex flex-col lg:flex-row h-[90vh]'>
                        <div className='hidden'>
                            {user && <ChatList fetchAgain={fetchAgain}/>}
                        </div>
                        {user &&
                        <ChatScreen fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
                        } 
                        {selectedChat && <ChatInfo />}
                    </div>
                </div>
                {/* </div> */}
            </>
            )
        }
    return content
}

export default ChatPage