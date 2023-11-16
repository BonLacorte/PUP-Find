import React, { useEffect, useState } from 'react';
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '../../features/config/ChatLogic.js';
import { ChatState } from '../../context/ChatProvider.js';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const [clickedMessageId, setClickedMessageId] = useState(null)
  const [messageDate, setMessageDate] = useState(null);

  const toggleMessageTimestamp = (messageId, senderId) => {
    if (clickedMessageId === messageId) {
      setClickedMessageId(null); // Hide timestamp if already clicked
    } else {
      setClickedMessageId(messageId);
    }
  }

  const [clickedMessageStyle, setClickedMessageStyle] = useState(null);

  const handleClickMessage = (messageId, senderId) => {
    if (clickedMessageId === messageId) {
      setClickedMessageStyle(null);
      setClickedMessageId(null); // Hide timestamp if already clicked
    } else {
      if (senderId === user._id) {
        setClickedMessageStyle({
          backgroundColor: '#670000', // Change to your desired darker background color
          color: '#fff',
        });
      } else {
        setClickedMessageStyle({
          backgroundColor: '#888888', // Change to your desired darker background color
          color: '#000',
        });
      }
      setClickedMessageId(messageId);
    }
  }

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const lastMessageTime = new Date(lastMessage.createdAt).getTime();
      const currentDate = new Date();


      setMessageDate(new Date(lastMessage.createdAt).toLocaleDateString([], { month: 'short',day: '2-digit',  }))
      
    }
  }, [messages]);

  const renderMessages = () => {
    let prevMessageTimestamp = null;
    
    return messages.map((m, i) => {
      const currentTimestamp = new Date(m.createdAt).getTime();
      const showTimestamp = (
        !prevMessageTimestamp || 
        (currentTimestamp - prevMessageTimestamp) >= 10 * 60 * 1000
      );
      
      prevMessageTimestamp = currentTimestamp;

      return (
        <>
          {showTimestamp && (
            <div className='w-full  border-green-500 flex items-center justify-center'>
              <span className="text-xs text-gray-500 mb-1  border-orange-500">
                {
                  new Date(m.createdAt).toLocaleDateString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
                }
              </span>
            </div>
          )}
          <div className='w-full flex  border-blue-500' key={m._id}>

            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic.url}
                />
              </Tooltip>
            )}
            { clickedMessageId === m._id && m.sender._id === user._id ?  
              <div className='flex justify-end items-center w-full mr-2'>
                <span className="text-xs text-gray-500">
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                  {/* {new Date(new Date(m.createdAt).getTime() + 8 * 60 * 60 * 1000).toISOString().slice(11, 16)} */}
                </span>
              </div>
              : null
            }

            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#800000" : "#EEEEEE"
                }`,
                color: `${
                  m.sender._id === user._id ? "#fff" : "#000"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 3,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                ...clickedMessageId === m._id ? clickedMessageStyle : {},
              }}
              onClick={() => handleClickMessage(m._id, m.sender._id)}
            >
                {m.content}
            </span>
            { clickedMessageId === m._id && m.sender._id !== user._id ?  
              <div className='flex items-center justify-center ml-2'>
                <span className="text-xs text-gray-500">
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {/* {new Date(new Date(m.createdAt).getTime() + 8 * 60 * 60 * 1000).toISOString().slice(11, 16)} */}
                </span>
              </div>
              : null
            }
          </div>
        </>
      );
    });
  };

  return (
    <ScrollableFeed>
      {renderMessages()}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
