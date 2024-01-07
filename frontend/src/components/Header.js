import React, { useState } from 'react';
import axios from "axios";
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import { Link, useNavigate } from 'react-router-dom';
import pic1x1 from './Miscellaneous/samplePics/pic1x1.jpg';
import UserListItem from './UserListItem';
import PulseLoader from 'react-spinners/PulseLoader'
import ChatLoading from './ChatLoading';
import { ChatState } from '../context/ChatProvider';
import "react-toastify/ReactToastify.min.css";
import NotificationBadge from "react-notification-badge";

import useAuth from '../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { BellIcon } from '@chakra-ui/icons';
import { Effect } from "react-notification-badge";
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { getSender } from '../features/config/ChatLogic';
import { server } from '../server';

const Header = () => {

    const { userInfo, accessToken } = useAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false)
    // const [result, setResult] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [search, setSearch] = useState("")

    const {
        setSelectedChat,
        // user,
        notification,
        setNotification,
        chats,
        setChats,
    } = ChatState();

    const navigate = useNavigate()

    const [sendLogout, { isLoadingLogout, isSuccessLogout, isErrorLogout, errorLogout }] = useSendLogoutMutation();

    const toggleLogout = () =>  {
        localStorage.removeItem("userInfo");
        sendLogout();
        navigate('/');
    }

    if (isLoadingLogout) return <p className="text-white">Logging Out...</p>;

    if (isErrorLogout) return <p className="text-white">Error: {errorLogout.data?.message}</p>;

    const toastTypes = ["success", "info", "warning", "error"];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleSearch = async (e) => {
        if (!search) {
            // console.log("Please enter something on search")
            return
        }
    
        try {
            setLoading(true);
    
            const config = {
            headers: {
                token: `Bearer ${accessToken}`,
            },
            };
    
            const { data } = await axios.get(`${server}/user?search=${search}`, config);
    
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            // console.log(error)
        }
    }
    
    const handleAccessChat = async (userId) => {
        try {
            // console.log(`handleAccessChat (userId)`,userId)

            setLoadingChat(true);
            const config = {
                headers: {
                "Content-type": "application/json",
                token: `Bearer ${accessToken}`,
                },
            };

            const { data } = await axios.post(`${server}/chat`, { userId }, config);
            // console.log(`data from accessChat`, data)

            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats])
            }
            

            // console.log(`chats in Header`,chats) // 

            setSelectedChat(data)
            // console.log(`setSelectedChat`, setSelectedChat)
            setLoadingChat(false)
            toggleDrawer()
        } catch (err) {
            // console.log(err)
            // setLoadingChat(false)
            // toast("Error, handleAccesschat", { autoClose: 7000, position: toast.POSITION.BOTTOM_LEFT })
        }
    }

    const consoleLogs = () => {
        // // console.log(canAccess)
        // // console.log(canAccessContent)
        // console.log(userInfo)
    }

    const user = {
        name: 'John Doe',
        avatar: pic1x1,
        email: 'john.doe@example.com',
    };



    return (
        <>
                <header className="flex justify-between items-center bg-gray-400 p-4">
                    
                    <div className="flex items-center w-1/3">
                    <div>
                        <div>
                            <input
                                type="text"
                                className="bg-gray-300 text-white px-4 py-2 rounded focus:outline-none"
                                placeholder="Search"
                                onClick={toggleDrawer}
                            />
                        </div>
                        
                    </div>
                    <div className='mx-2'>
                            <p className='menu-link'>
                                <Link to="/chats" >Chat</Link>
                                <Link to="/find" className='mx-2'>SmartFind</Link>
                                <Link to="/report" className='mx-2'>Reports</Link>
                            </p>
                        </div>
                    </div>
        
                    <div className="flex items-center w-1/3 justify-center">
                    <div className="flex">
                        <h1 className="text-black font-bold text-3xl mx-auto">CostaChats</h1>
                    </div>
                    </div>
        
                    <div className="flex items-center w-1/3 justify-end">
                        <div>
                        <Menu>
                            <MenuButton p={1}>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize="2xl" m={1} />
                            </MenuButton>
                            <MenuList pl={2}>
                            {!notification.length && "No New Messages"}
                            {notification.map((notif) => (
                                <MenuItem
                                key={notif._id}
                                onClick={() => {
                                    setSelectedChat(notif.chat);
                                    setNotification(notification.filter((n) => n !== notif));
                                }}
                                >
                                {notif.chat.isGroupChat
                                    ? `New Message in ${notif.chat.chatName}`
                                    : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                            </MenuList>
                        </Menu>
            
                            <div className="relative inline-block text-left">
                            <button className="mr-2" onClick={toggleMenu}>
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-black"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                            {isMenuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                <div
                                    className="py-1"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="user-menu"
                                >
                                {/* <ProfileModal isProfileOpen={isProfileOpen} onClose={closeModal} user={user}>    
                                    <button
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
                                    role="menuitem"
                                    onClick={openModal}
                                    >
                                    My Profile
                                    </button>
                                </ProfileModal> */}
                                    <hr className="my-2 border-gray-300" />
                                    <button
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
                                    role="menuitem"
                                    onClick={toggleLogout}
                                    >
                                    Logout
                                    </button>
                                </div>
                                </div>
                            )}
                            {isDrawerOpen && (
                                <div className="fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg">
                                    <div className="p-4">
                                        {/* Drawer Header  */}
                                        <div className="flex items-center mb-4">
                                            <button className="mr-2" onClick={toggleDrawer}>
                                                <FontAwesomeIcon icon={faArrowLeft} />
                                            </button>
                                            <h2 className="text-lg font-bold">Search User</h2>
                                        </div>
                
                                        {/* Search Bar and Button  */}
                                        <div className="flex">
                                            <input type="text" className="flex-grow p-2 rounded focus:outline-none bg-gray-100" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                            <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSearch}>Go</button>
                                        </div>
                
                                        {/* User List   */}
                                        <ul className="mt-4">
                                            { loading ? (<ChatLoading />) :(
                                                searchResult?.map((user) => (<UserListItem key={user._id} user={user} handleFunction={() => handleAccessChat(user._id)} />)))
                                            }
                                            {loadingChat && <PulseLoader color={"#000"} />}
                                        </ul>
                                    </div>
                                </div>
                            )}
                            </div>
                        </div>
                    </div>
                </header>
            </>
    )
};

export default Header;
