import React from 'react';
// import SingleChat from './SingleChat';
import { ChatState } from '../context/ChatProvider'; 
import SingleChat from './SingleChat';

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    // <div
    //   className=
    //     {`${selectedChat ? 'flex' : 'hidden'} 
    //     items-center flex-col p-3 bg-white w-full md:w-68% rounded-lg border border-gray-300`}
    // >
    <div className={`${selectedChat ? 'flex' : 'hidden'} md:flex flex-col p-3 bg-white w-full md:w-2/3 rounded-lg border border-gray-300`}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      {/* Single Chat */}
    </div>
  );
};

export default Chatbox;
