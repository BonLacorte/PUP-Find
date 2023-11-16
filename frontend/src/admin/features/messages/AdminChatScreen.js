import React from 'react'
import { ChatState } from '../../../context/ChatProvider';
import SingleChat from '../../../components/SingleChat';
import AdminSingleChat from './AdminSingleChat';

const AdminChatScreen = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();

    return (
        <div className={`${selectedChat ? 'flex' : 'hidden'} lg:flex flex-col p-3 bg-white w-full lg:w-3/5 rounded-lg border border-gray-300`}>
            <AdminSingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
            {/* Single Chat */}
        </div>
    );
}

export default AdminChatScreen