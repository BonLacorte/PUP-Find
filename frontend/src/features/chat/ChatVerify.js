import React from 'react'
import { ChatState } from '../../context/ChatProvider';
import ChatPage from './ChatPage';
import PulseLoader from 'react-spinners/PulseLoader';

const ChatVerify = () => {

    const {
        selectedChat,
        setSelectedChat,
        user,
        notification,
        setNotification,
        chats,
        setChats,
    } = ChatState();

    const content = selectedChat
        ? <ChatPage/> : 
            <div className="w-full h-screen flex items-center justify-center">
                <div className="flex justify-center">
                    <PulseLoader  color={"#000"} />
                </div>
            </div>

    return content
}

export default ChatVerify