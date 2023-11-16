import React from 'react'
import { ChatState } from '../../context/ChatProvider';
import ChatPage from './ChatPage';

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
        ? <ChatPage/> : <h1>Loading...</h1>

    return content
}

export default ChatVerify