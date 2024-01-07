import React from 'react'
import { ChatState } from '../../context/ChatProvider';
import SingleChat from '../../components/SingleChat';

const ChatScreen = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();

    // console.log(`ChatScreen selectedChat: `, selectedChat)

    return (
        <div className={`${selectedChat || selectedChat === undefined ? 'flex' : 'hidden'} lg:flex flex-col p-3 bg-white w-full lg:w-2/3 rounded-lg border border-gray-300`}>
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
            {/* Single Chat */}
        </div>
    );
}

export default ChatScreen