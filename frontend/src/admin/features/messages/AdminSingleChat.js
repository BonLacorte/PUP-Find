import React, { useEffect, useState } from 'react'
import { ChatState } from '../../../context/ChatProvider'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faXmark, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
// import { getSender, getSenderAvatar, getSenderFull } from '../features/config/ChatLogic';
import { getSender, getSenderAvatar, getSenderFull } from '../../../features/config/ChatLogic';
import ScrollableChat from '../../components/ScrollableChat';
import useAuth from '../../hooks/useAdminAuth';
import axios from 'axios';
import PulseLoader from 'react-spinners/PulseLoader'
import { io } from 'socket.io-client';
import { Image, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box} from "@chakra-ui/react";
import ScrollableFeed from 'react-scrollable-feed';
import useAdminAuth from '../../hooks/useAdminAuth';
import { server } from '../../../server';

const ENDPOINT = `${server}`
var socket, selectedChatCompare

const AdminSingleChat = ({ fetchAgain, setFetchAgain }) => {

    const {accessToken} = useAuth();
    
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [lastMessage, setLastMessage] = useState()
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [openChatInfo, setOpenChatInfo] = useState(false);

    const { selectedChat, setSelectedChat, user, notification, setNotification, chats } = ChatState();

    const fetchMessages = async () => {
        if (!selectedChat) {
            return
        };
    
        try {
        const config = {
            headers: {
            token: `Bearer ${accessToken}`,
            },
        };
    
        setLoading(true);
    
        const { data } = await axios.get(
            `${server}/message/${selectedChat._id}`, config);

        setMessages(data);
        setLoading(false);
    
        socket.emit("join chat", selectedChat._id);
        } catch (error) {
            // console.log(error)
            // console.log('SingleChat fetchMessages-Failed to fetch the Messages')
        }
    }

    const updateLastSeenMessage = async (message) => {
        try {
            const config = {
                headers: {
                    token: `Bearer ${accessToken}`,
                },
            };
            const { data } = await axios.post(`${server}/chat/update-last-seen-message`,
                {
                    chatId: selectedChat._id,
                    messageId: message._id,
                    messageContent: message.content
                }
            , config);
        } catch (error) {
            // console.log(error)
            // console.log('SingleChat updateLastSeenMessage-Failed to update last seen message')
        }
    }

    // Function to update User2's last seen message
    const updateUser2LastSeenMessage = async (newMessageReceived) => {
        try {
            // Make an API request to update User2's last seen message
            const config = {
                headers: {
                    token: `Bearer ${accessToken}`,
                },
            };
            await axios.post(
                `${server}/chat/update-last-seen-message`,
                {
                    chatId: newMessageReceived.chat._id,
                    messageId: newMessageReceived._id,
                    messageContent: newMessageReceived.content
                },
                config
            );
        } catch (error) {
            // console.log(error);
            // console.log("Failed to update User2's last seen message");
        }
    };

    const sendMessage = async (event) => {
        if ((event.key === "Enter" && newMessage) || (event.target.classList.contains("send-icon") && newMessage)) {
            // socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        token: `Bearer ${accessToken}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(`${server}/message`,
                    {
                        content: newMessage,
                        chatId: selectedChat,
                    },
                config
                );

                await updateLastSeenMessage(data)

                socket.emit("new message", data);
                setMessages([...messages, data]);
                // console.log({messages})
            } catch (error) {
                // console.log(error)
                // console.log('SingleChat sendMessage-Failed to send the Message')
            };
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    
        if (!selectedChat) {
            setSelectedChat(chats[0])
            // console.log('set chat[0] as selectedChat',{selectedChat})
        };

        return () => {
            socket.disconnect();
        };

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (selectedChat && selectedChatCompare) {
            socket.emit("chat closed", selectedChatCompare);
            // console.log('chat closed')
            socket.emit("leave chat", selectedChatCompare);
            // console.log('leave chat')
        }

        fetchMessages();

        if (selectedChat && selectedChat.latestMessage) {
            updateLastSeenMessage(selectedChat.latestMessage)
        }

        if (socket) {
            socket.on("message recieved", (newMessageReceived) => {
                if (selectedChat && selectedChat._id === newMessageReceived.chat._id) {
                    // console.log(`newMessageReceived`,newMessageReceived)
                    setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
                    updateUser2LastSeenMessage(newMessageReceived);
                }
            });
        }
    
        return () => {
            if (socket) {
                socket.off("message recieved");
            }
        };

        // eslint-disable-next-line
    }, [selectedChat, socket]);

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
    
        if (!socketConnected) return;
    
        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;
        if (timeDiff >= timerLength && typing) {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
        }
        }, timerLength);
    };


    return (
        <div className='h-screen border-blue-700'>
            {
                selectedChat 
                ? (
                    <>
                        <div className='flex items-center justify-between pb-3 px-2 w-full '>
                        {/* <div className={`md:${selectedChat ? 'hidden' : 'hidden' }flex items-center justify-between pb-3 px-2 w-full`}> */}
                            <button
                                className='lg:hidden'
                                onClick={() => setSelectedChat("")}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </button>
                            {!selectedChat.isGroupChat ? (
                                <div className='flex flex-row'>

                                    <div className='flex flex-row items-center hover:bg-gray-400 cursor-pointer p-2 rounded-lg' onClick={() => setOpenChatInfo(true)}>
                                        <img src={getSenderAvatar(user, selectedChat.users)} alt="" className="w-10 h-10 rounded-full mr-2"/>
                                        <b>{getSender(user, selectedChat.users)}</b>
                                    </div>
                                    
                                    {/* <ProfileModal user={getSenderFull(user, selectedChat.users)} /> */}
                                </div>
                                ) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    {/* <UpdateGroupChatModal
                                    fetchMessages={fetchMessages}
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    /> */}
                                </>
                                )}
                        </div>
                        <div className="flex flex-col justify-end p-3 w-full h-[92vh] rounded-lg overflow-hidden border-red-700">
                            {loading ? (
                                <div className="self-center">
                                    {/* <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-500"></div> */}
                                    <PulseLoader color={"#000"} />
                                </div>
                            ) : (
                                <div className="flex flex-col overflow-y-auto">
                                    <ScrollableChat messages={messages} />
                                </div>
                            )}

                                <div className="flex flex-row mt-3 gap-2">
                                    {/* {istyping && (
                                        <div>
                                            <Lottie
                                                options={defaultOptions}
                                                // height={50}
                                                width={70}
                                                style={{ marginBottom: 15, marginLeft: 0 }}
                                            />
                                        </div>
                                    )} */}

                                    <input
                                    type="text"
                                    className="w-full bg-gray-300 p-2 rounded"
                                    placeholder="Enter a message.."
                                    value={newMessage}
                                    onChange={typingHandler}
                                    onKeyDown={sendMessage}
                                    />
                                    <button className='flex items-center px-3 bg-gray-300 rounded send-icon
                                    hover:bg-gray-400 transition duration-200' onClick={sendMessage} >
                                            <FontAwesomeIcon 
                                                icon={faPaperPlane}
                                                className="send-icon"
                                            />
                                    </button>
                                </div>
                            </div>
                    </>
                ) 
                : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-3xl pb-3 font-work-sans">
                            Click on a user to start chatting
                        </p>
                    </div>
                )
            }
            {openChatInfo && (
                <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
                    <div className="w-[90%] 800px:w-[40%] h-[80vh] lg:h-[70vh] bg-white rounded-md shadow p-4">
                        <div className="w-full flex justify-end">
                            {/* <RxCross1
                                size={30}
                                className="cursor-pointer"
                                onClick={() => openChatInfo(false)}
                            /> */}
                            {/* <img src={faXmark} alt="" onClick={() => openChatInfo(false)}/> */}
                            <button
                                className='cursor-pointer'
                                onClick={() => setOpenChatInfo(false)}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <div className=''>
                            <ChatInfo/>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const ChatInfo = () => {
    const { selectedChat, user } = ChatState();
    const { uid, accessToken } = useAdminAuth();

    const getChatMate = () => {
        if (selectedChat && selectedChat.users) {
            return selectedChat.users.find(u => u._id !== user._id);
        }
        return null;
    };

    const chatMate = getChatMate();

    const [reports, setReports] = useState(null)
    const [missingReports, setMissingReports] = useState(null)
    const [foundReports, setFoundReports] = useState(null)

    // Create a function to fetch all reports of a user
    const getAllReportsByUser = async () => {
        
        let creatorId = chatMate.uid
        
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    token: `Bearer ${accessToken}`,
                },
            };

            let url = `${server}/report/creator/${creatorId}`;
            
            // console.log(url)
            const { data } = await axios.get(url, config); // Replace with your API endpoint
            
            // Filter out reports with 'Claimed' status
            // const filteredData = data.filter((report) => report.reportStatus !== 'Claimed');
            
            // console.log(`data`,data)
            // console.log(`selectedChat`, selectedChat)
            
            const foundReport = data.filter((report) => report.reportType === 'FoundReport');
            const missingReport = data.filter((report) => report.reportType === 'MissingReport');

            // await setReports(data); // Set the reports in state
            setFoundReports(foundReport)
            setMissingReports(missingReport)
            // // console.log(`reports`,reports)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        // // console.log('Chat Info', selectedChat);
        if (selectedChat) {
            getAllReportsByUser()
        }

        // eslint-disable-next-line
    }, [selectedChat]);

    return (
        <div>
            {selectedChat ? (
                <div className='border-orange-700 lg:h-[60vh] flex flex-col'>
                    <div className="pb-3 px-3 flex justify-center text-xl font-bold font-work-sans w-full">
                        Chat Information
                    </div>
                    {/* <div className="border border-red-700"> */}
                    <div>
                        {chatMate ? (
                            <div className="p-3 flex lg:flex-row flex-col justify-around items-center w-full">
                                {/* Chat Info */}
                                {/* <h2 className="text-lg font-semibold">Chat Mate:</h2> */}
                                <div className="flex flex-col items-center my-2 w-full lg:w-1/5 border-blue-700">
                                    <Image src={chatMate.pic.url} alt={chatMate.name} boxSize="100px" rounded="full" />
                                    <div className="mt-2 flex flex-col items-center ">
                                        <p className="font-semibold">{chatMate.name}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col justify-center items-center w-full lg:w-4/5 border-red-700 overflow-y-auto max-h-[380px] lg:max-h-[600px] gap-4'>
                                    <p className="font-semibold">Reports</p>
                                    <ScrollableFeed>
                                        <div className='flex lg:flex-row flex-col lg:justify-betweenborder-green-700 gap-4 lg:gap-8 w-auto'>
                                            <div className='px-2 lg:w-1/2'>
                                                <p className="font-semibold mb-2">Missing Reports</p>
                                                {missingReports ?
                                                    <div className="overflow-y-auto max-h-[200px] lg:max-h-[350px] border-blue-500 ">
                                                        <ScrollableFeed>
                                                            <Accordion defaultIndex={[0]} allowMultiple>
                                                                {missingReports.map((report) => (
                                                                    <AccordionItem key={report._id}>
                                                                        <h2>
                                                                            <AccordionButton>
                                                                                <Box flex="1" textAlign="left">
                                                                                    {report.itemName}
                                                                                </Box>
                                                                                <AccordionIcon />
                                                                            </AccordionButton>
                                                                        </h2>
                                                                        <AccordionPanel pb={4}>
                                                                            
                                                                            <p className="font-bold">Date Found:</p>
                                                                            <p>{new Date(report.date).toISOString().slice(0, 10)}</p>

                                                                            <p className="font-bold">Location Found:</p>
                                                                            <p>{report.location}</p>

                                                                            <p className="font-bold">Item Description:</p>
                                                                            <p>{report.itemDescription}</p>

                                                                            <div className="grid grid-cols-2 gap-4 py-2">
                                                                                {report.itemImage ? report.itemImage.map((image) => (
                                                                                    <Image
                                                                                        key={image._id}
                                                                                        src={image.url}
                                                                                        alt={`Image of ${report.itemName}`}
                                                                                        boxSize="100px"
                                                                                    />
                                                                                ))
                                                                                :
                                                                                null }
                                                                            </div>

                                                                            <p className='w-max'>
                                                                                {report.reportStatus === "Missing" 
                                                                                    ? 
                                                                                    <div className='px-2 border-2 border-red-500 font-semibold text-red-500 rounded-2xl'>
                                                                                        <p>Missing</p>
                                                                                    </div>
                                                                                    :
                                                                                    <div className='px-2 border-2 border-green-500 font-semibold text-green-500 rounded-2xl'>
                                                                                        <p>Claimed</p>
                                                                                    </div>
                                                                                }
                                                                            </p>      

                                                                        </AccordionPanel>

                                                                    </AccordionItem>
                                                                ))}
                                                            </Accordion>
                                                        </ScrollableFeed>
                                                    </div>   
                                                : 
                                                    <div className="flex items-center justify-center h-full">
                                                        <p className="text-3xl pb-3 font-work-sans">
                                                            No Missing Reports.
                                                        </p>
                                                    </div>
                                                } 
                                            </div>
                                            <div className='px-2 lg:w-1/2'>
                                                <p className="font-semibold mb-2">Found Reports</p>
                                                {foundReports ? 
                                                    <div className="overflow-y-auto max-h-[200px] lg:max-h-[350px] border-blue-500">
                                                        <ScrollableFeed>
                                                            <Accordion defaultIndex={[0]} allowMultiple>
                                                            {foundReports.map((report) => (
                                                                <AccordionItem key={report._id}>
                                                                    <h2>
                                                                        <AccordionButton>
                                                                            <Box flex="1" textAlign="left">
                                                                                {report.itemName}
                                                                            </Box>
                                                                            <AccordionIcon />
                                                                        </AccordionButton>
                                                                    </h2>
                                                                    <AccordionPanel pb={4}>
                                                                        
                                                                        <p className="font-bold">Date Found:</p>
                                                                        <p>{new Date(report.date).toISOString().slice(0, 10)}</p>

                                                                        <p className="font-bold">Location Found:</p>
                                                                        <p>{report.location}</p>

                                                                        <p className="font-bold">Item Description:</p>
                                                                        <p>{report.itemDescription}</p>

                                                                        <div className="grid grid-cols-2 gap-4 py-2">
                                                                            {report.itemImage ? report.itemImage.map((image) => (
                                                                                <Image
                                                                                    key={image._id}
                                                                                    src={image.url}
                                                                                    alt={`Image of ${report.itemName}`}
                                                                                    boxSize="100px"
                                                                                />
                                                                            ))
                                                                            :
                                                                            null }
                                                                        </div>

                                                                        <p className='w-max'>
                                                                            {report.reportStatus === "Processing" 
                                                                                ? 
                                                                                <div className='px-2 border-2 border-red-500 font-semibold text-red-500 rounded-2xl'>
                                                                                    <p>Processing</p>
                                                                                </div>
                                                                                : report.reportStatus === "Claimable" 
                                                                                ?
                                                                                <div className='px-2 border-2 border-blue-500 font-semibold text-blue-500 rounded-2xl'>
                                                                                    <p>Claimable</p>
                                                                                </div>
                                                                                :
                                                                                <div className='px-2 border-2 border-green-500 font-semibold text-green-500 rounded-2xl'>
                                                                                    <p>Claimed</p>
                                                                                </div>
                                                                            }
                                                                        </p>  

                                                                    </AccordionPanel>

                                                                </AccordionItem>
                                                            ))}
                                                            </Accordion>
                                                        </ScrollableFeed>
                                                    </div>
                                                :
                                                    <div className="flex items-center justify-center h-full">
                                                        <p className="text-3xl pb-3 font-work-sans">
                                                            No Found Reports.
                                                        </p>
                                                    </div>
                                                }
                                            </div>
                                            
                                        </div>
                                    </ScrollableFeed>
                                </div>
                            </div>
                        ) : (
                            <p className="p-3">No chat mate information available.</p>
                        )}

                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-3xl pb-3 font-work-sans">
                        No chat selected.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AdminSingleChat