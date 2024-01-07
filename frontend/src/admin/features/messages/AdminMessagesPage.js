import React, { useEffect, useState } from 'react'
import AdminChatList from './AdminChatList';
import AdminChatScreen from './AdminChatScreen';
import AdminChatInfo from './AdminChatInfo';
import { ChatState } from '../../../context/ChatProvider';
import useAdminAuth from '../../hooks/useAdminAuth';
import axios from 'axios';
import PulseLoader from 'react-spinners/PulseLoader';
import { server } from '../../../server';

const AdminMessagesPage = () => {

    const { accessToken } = useAdminAuth();

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
        
        // Separate chats into two arrays: with latest message and without latest message
        const chatsWithLatestMessage = data.filter(chat => chat.latestMessage);

        // Sort chats with latest messages based on updatedAt in descending order
        chatsWithLatestMessage.sort((a, b) => {
            const dateA = new Date(a.latestMessage.updatedAt);
            const dateB = new Date(b.latestMessage.updatedAt);
            return dateB - dateA;
        });

        // Concatenate the two arrays, placing chats without latest messages at the end
        const sortedChats = [...chatsWithLatestMessage];

        await setChats(sortedChats);
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
        // eslint-disable-next-line
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
                <div className="mx-auto flex justify-start flex-col w-full border-yellow-400">
                        <div className='flex flex-col lg:flex-row h-screen'>
                            {user && <AdminChatList fetchAgain={fetchAgain}/>}
                            {user &&
                                <AdminChatScreen fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
                            } 
                            {/* <AdminChatInfo /> */}
                            {selectedChat && <AdminChatInfo />}
                        </div>
                </div>
            </>
            )
        }

    return content
}

export default AdminMessagesPage