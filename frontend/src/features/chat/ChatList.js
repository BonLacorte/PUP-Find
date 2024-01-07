import React, { useEffect, useState } from 'react'
import ChatLoading from '../../components/ChatLoading'
import { ChatState } from '../../context/ChatProvider';
import { getSender, getSenderAvatar, latestMessage } from '../config/ChatLogic';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { io } from 'socket.io-client';
import { server } from '../../server';

const ENDPOINT = `${server}`
var socket, selectedChatCompare

const ChatList = ({ fetchAgain }) => {

    const { userId, accessToken } = useAuth();

    const [loggedUser, setLoggedUser] = useState();
    const [seenEqualMessage, setSeenEqualMessage] = useState(true)

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
        // // console.log(`chats in ChatList`,{chats})
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
    
            if (data.length > 0) {
                setSelectedChat(data[0]);
            }
    
            await setChats(data);
            // // console.log(`chats in ChatList`,{chats})
            } catch (err) {
                // console.log(err)
            }
        }

        fetchChatsRefresh()

        socket = io(ENDPOINT);
        socket.emit("setup", user);

        // eslint-disable-next-line
    }, [fetchAgain])

    useEffect(() => {
        // fetchChats()
        
        if (socket) {
            socket.on("message recieved", (newMessageReceived) => {
                // console.log('message recieved')
                fetchChats()
            });
        }

        if (socket) {
            socket.on("message recieved", (newMessageReceived) => {
                fetchChats()
            });
        }

        // real-time updating of ChatList's list of chat conversation's latest messages whether the user are online of not and whether the user is the sender of the latest message or not
        if (socket) {
            socket.on("update chat list", (newMessageReceived) => {
                // // console.log(`newMessageReceived`, newMessageReceived)
                fetchChats()
                // console.log(`selectedChat`,selectedChat)
                // // console.log(`chats`,chats)
                // // console.log(`newMessageReceived`,newMessageReceived)
                
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

    return (
        <>
            <div className={`${selectedChat ? 'hidden' : 'flex'} lg:${selectedChat ? 'flex' : 'flex'} flex-col items-center p-3 bg-white w-full lg:w-1/3 rounded-lg border border-gray-300`}>
                <div className="flex flex-col p-3 bg-gray-200 w-full h-full rounded-lg overflow-hidden">
                {chats ? (
                    <div className="overflow-y-scroll scrollbar-none">
                    {chats.map((chat) => (
                        <div
                        key={chat._id}
                        onClick={() => {
                            // latestMessage(chat)
                            fetchChats()
                            setSelectedChat(chat)
                        }}
                        className={`cursor-pointer p-3 mb-2 rounded-lg ${
                            selectedChat ? selectedChat._id === chat._id ? 'bg-primaryColor text-white' : 'bg-gray-300' : 'bg-gray-300'
                        }`}
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
                                                        {chat.latestMessage.content.length > 50 ? chat.latestMessage.content.substring(0, 51) + '...' : chat.latestMessage.content}
                                                        {" "}●{" "}
                                                        {convertUTCToLocalTime(chat.latestMessage.createdAt, 8)}
                                                    </div> 
                                                    : <div>
                                                        <b>{chat.latestMessage.sender.name} : </b>
                                                        {" "}
                                                        {chat.latestMessage.content.length > 50 ? <b>{chat.latestMessage.content.substring(0, 51) + '...'}</b> : <b>{chat.latestMessage.content}</b>}
                                                        {" "}⬤{" "}
                                                        {convertUTCToLocalTime(chat.latestMessage.createdAt, 8)}
                                                    </div>) 
                                                : null
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <ChatLoading />
                )}
                </div>
            </div>
        </>
    )
}

export default ChatList

// Compare this snippet from frontend\src\features\chat\ChatScreen.js:
