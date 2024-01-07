import React, { useEffect, useState } from 'react'
import AdminChatLoading from '../../components/AdminChatLoading'
// import { getSender } from '../config/ChatLogic';
import { getSender, getSenderUid, getSenderAvatar, latestMessage } from '../../../features/config/ChatLogic'
import useAdminAuth from '../../hooks/useAdminAuth';
import axios from 'axios';
import { ChatState } from '../../../context/ChatProvider';
import { io } from 'socket.io-client';
import { server } from '../../../server';

const ENDPOINT = `${server}`
var socket

const AdminChatList = ({ fetchAgain }) => {

    const { userId, accessToken } = useAdminAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [loggedUser, setLoggedUser] = useState();

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
        const chatsWithoutLatestMessage = data.filter(chat => !chat.latestMessage);

        // Sort chats with latest messages based on updatedAt in descending order
        chatsWithLatestMessage.sort((a, b) => {
            const dateA = new Date(a.latestMessage.updatedAt);
            const dateB = new Date(b.latestMessage.updatedAt);
            return dateB - dateA;
        });

        // Concatenate the two arrays, placing chats without latest messages at the end
        const sortedChats = [...chatsWithLatestMessage];

        await setChats(sortedChats);
        // console.log(`list of chats`, data)
        } catch (err) {
            // console.log(err)
        }
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
        
        const fetchChatsRefresh = async () => {
            try {
                const config = {
                headers: {
                    token: `Bearer ${accessToken}`,
                    },
                };
    
            const { data } = await axios.get(`${server}/chat`, config);
            // console.log(`list of chats`, data)

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

            if (sortedChats.length > 0) {
                setSelectedChat(sortedChats[0]);
            }
            await setChats(sortedChats);
            
            } catch (err) {
                // console.log(err)
            }
        }

        fetchChatsRefresh()

        socket = io(ENDPOINT);
        socket.emit("setup", user);

        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        // fetchChats()
        
        if (socket) {
            socket.on("message recieved", (newMessageReceived) => {
                // console.log('message recieved')
                fetchChats()
            });
        }

        // real-time updating of ChatList's list of chat conversation's latest messages whether the user are online of not and whether the user is the sender of the latest message or not
        if (socket) {
            socket.on("update chat list", (newMessageReceived) => {
                fetchChats()
                // console.log(`selectedChat`,selectedChat)
                // console.log(`chats`,chats)
            });
        }
        return () => {
            // Remove the event listener when the component unmounts
            socket.off("update chat list");
            socket.off("message recieved");
        };
        // eslint-disable-next-line
    }, [socket])

    const convertUTCToLocalTime = (utcDateTimeString, offset) => {
        const utcDate = new Date(utcDateTimeString);
        const currentDate = new Date();

        // Calculate the time difference in milliseconds
        const timeDifference = currentDate - utcDate;

        // Helper function to format time units
        const formatTimeUnit = (value, unit) => {
            return `${value}${unit}`;
        };

        // Calculate time units (weeks, days, hours, minutes, seconds)
        const weeks = Math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000));
        const days = Math.floor((timeDifference % (7 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
        const hours = Math.floor((timeDifference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000);

        // Determine the appropriate format based on the time difference
        if (weeks > 0) {
            return formatTimeUnit(weeks, 'w');
        } else if (days > 0) {
            return formatTimeUnit(days, 'd');
        } else if (hours > 0) {
            return formatTimeUnit(hours, 'h');
        } else if (minutes > 0) {
            return formatTimeUnit(minutes, 'm');
        } else {
            return formatTimeUnit(seconds, 's');
        }
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

    const filteredChats = chats.filter(chat => {
        const sender = getSenderUid(loggedUser, chat.users) || getSender(loggedUser, chat.users) 
        // console.log(sender, "sender")
        return sender.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <>
            <div className={`${selectedChat ? 'hidden' : 'flex'} lg:${selectedChat ? 'flex' : 'flex'} flex-col items-center p-3 bg-white lg:w-1/5 rounded-lg border border-gray-300`}>
                <div className='w-full'>
                    <div className="pb-3 px-3 flex justify-center w-full">
                        <h1 className="text-3xl font-bold text-primaryColor">Messages</h1>
                    </div>
                    <div className="pb-3 flex justify-center items-center w-full">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="bg-gray-100 border-2 w-full px-2 py-1 rounded-lg"
                        />
                    </div>
                </div>
                <div className="flex flex-col p-3 bg-gray-200 w-full h-full rounded-lg overflow-hidden">
                {chats ? (
                    <div className="w-full overflow-y-scroll scrollbar-none">
                    {filteredChats.map((chat) => (
                        <div
                        key={chat._id}
                        onClick={() => {
                            fetchChats()
                            setSelectedChat(chat)
                        }}
                        className={`cursor-pointer p-3 mb-2 rounded-lg ${
                            selectedChat ? selectedChat._id === chat._id ? 'bg-primaryColor text-white' : 'bg-gray-300' : 'bg-gray-300'
                        }
                        hover:bg-gray-400`}
                        >
                            <div className='flex flex-row'>
                                <img src={getSenderAvatar(loggedUser, chat.users)} alt="" className="w-10 h-10 rounded-full mr-2"/>
                                <div className='flex flex-col'>
                                    <div className="font-bold">
                                        {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                                    </div>
                                    {chat.latestMessage && (
                                        <div className="text-xs">
                                            {
                                                chat.latestMessage ? 
                                                    (latestMessage(loggedUser, chat, userId) ? 
                                                    <div className='flex flex-row'>
                                                        <b>{chat.latestMessage.sender.name}   </b>:
                                                        {" "}
                                                        {chat.latestMessage.content.length > 20 ? chat.latestMessage.content.substring(0, 18) + '...' : chat.latestMessage.content}
                                                        {" "}●{" "}
                                                        {convertUTCToLocalTime(chat.latestMessage.createdAt, 8)}
                                                    </div> 
                                                    : <div>
                                                        <b>{chat.latestMessage.sender.name} : </b>
                                                        {" "}
                                                        {chat.latestMessage.content.length > 20 ? <b>{chat.latestMessage.content.substring(0, 18) + '...' }</b> : <b>{chat.latestMessage.content}</b>}
                                                        {" "}⬤{" "}
                                                        {convertUTCToLocalTime(chat.latestMessage.createdAt, 8)}
                                                    </div>) 
                                                : null
                                            }

                                            
                                            {/* {userId} */}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            
                        </div>
                    ))}
                    </div>
                ) : (
                    <AdminChatLoading />
                )}
                </div>
            </div>
        </>
    )
}

export default AdminChatList

// Compare this snippet from frontend\src\features\chat\ChatScreen.js:
