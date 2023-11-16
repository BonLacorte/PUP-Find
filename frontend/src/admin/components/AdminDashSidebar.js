import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faArrowLeft, faFolder, faHashtag, faHome, faMessage, faUser, faRightFromBracket, faEnvelope,  } from '@fortawesome/free-solid-svg-icons';
import home from './../../img/home.png';
import folders from './../../img/folders.png';
import users from './../../img/users.png';
import hash from './../../img/hash.png';
import envelope from './../../img/Envelope.png';
import logo from './../../img/Redpupfind 4.png';
import miniLogo from './../../img/Redlogo 1.png';
import useAdminAuth from '../hooks/useAdminAuth';
import { useSendLogoutMutation } from '../features/auth/adminAuthApiSlice';
import { toast } from 'react-toastify';

const AdminDashSidebar = () => {

    const { userId, name, accessToken } = useAdminAuth()

    const navigate = useNavigate()

    const [sendLogout, { isLoadingLogout, isSuccessLogout, isErrorLogout, errorLogout }] = useSendLogoutMutation();

    const toggleLogout = () =>  {
        localStorage.removeItem("userInfo");
        sendLogout();
        toast.success("User successfully logged out!");
        navigate('/admin/');
    }

    // Define the list of webpages for the sidebar
    const webpages = [
        { name: 'Home', path: '', icon: faHome },
        { name: 'Messages', path: 'messages', icon: faEnvelope },
        { name: 'Users', path: 'users', icon: faUsers },
    ];

    const location = useLocation();

    return (
        <div className="w-full h-screen shadow-sm overflow-y-scroll sticky top-0 left-0 z-10 border-blue-700">
        {/* <div className="w-1/6 h-screen p-4 border-r flex flex-col items-center justify-between border-red-700"> */}
            {/* <div className='w-full flex items-center p-4'> */}
                {/* <h2 className="text-xl font-bold mb-4 w-full flex flex-row">Admin Dashboard</h2> */}
                <div className='border-blue-700  flex justify-center'>
                    <img src={logo} alt="" className='hidden md:w-[100px] md:flex md:items-center md:p-4'/>
                    <img src={miniLogo} alt="" className='md:hidden h-[80px] w-[80px] flex items-center py-4'/>
                </div>
                
                
                {/* <div className='flex flex-row'>
                    <Link to="/" className="flex flex-row items-center mb-4">
                        <img src={user} alt="" />
                    </Link>
                    <Link to="/" className="flex flex-row items-center mb-4">
                        <img src={gear} alt="" />
                    </Link>
                    <Link to="/
                    " className="flex flex-row items-center mb-4">
                        <img src={notification} alt="" />
                    </Link>
                </div> */}
                <div className='w-full flex justify-center items-center px-4 border-orange-400'>
                    <ul className=' border-yellow-500 flex flex-col'>
                        {webpages.map((page, index) => (
                            
                                <Link
                                    to={`/admin/dash/${page.path}`}
                                    className={`${location.pathname === `/admin/dash/${page.path}` ? 'font-bold bg-yellow-100 w-full' : ''} flex flex-row w-full justify-center items-center pl-4 hover:bg-yellow-100`}
                                >
                                    <li key={index} className="mb-1 h-14 w-full flex flex-row justify-start items-center border-blue-500 ">
                                        {/* <FontAwesomeIcon icon={page.icon} /> */}
                                        <div className='border-red-700'>
                                            {/* <img src={page.icon} alt="" className='flex '/> */}
                                            <FontAwesomeIcon icon={page.icon} size='xl'/>
                                        </div>
                                        <span className='ml-2 hidden md:flex'>{page.name}</span>
                                    </li>
                                    {/* <button
                                        className="flex justify-start items-center pl-4 text-sm w-full"
                                        role="menuitem"
                                        onClick={toggleLogout}
                                        >
                                            <div className="mb-1 gap-2 h-14 w-full flex flex-row items-center border-purple-500 hover:bg-yellow-100">
                                                <FontAwesomeIcon icon={faRightFromBracket} size='xl'/>
                                                <span className='ml-2 hidden md:flex'>Logout</span>
                                            </div>
                                    </button> */}
                                </Link>
                            
                        ))}
                        <button
                            className="flex justify-start items-center pl-4 text-sm w-full border-purple-500 hover:bg-yellow-100"
                            role="menuitem"
                            onClick={toggleLogout}
                            >
                                <div className="mb-1 gap-2 h-14 w-full flex flex-row items-center ">
                                    <FontAwesomeIcon icon={faRightFromBracket} size='xl'/>
                                    <span className='ml-2 hidden md:flex'>Logout</span>
                                </div>
                        </button>
                    </ul>
                </div>
        </div>
    );
};

export default AdminDashSidebar;
