import React from 'react';
import { Link } from 'react-router-dom';
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DashFooter = () => {
    return (
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-primaryColor p-2 h-[10vh] flex flex-col justify-center">
            <div className="flex justify-around items-center">
                <div className=''>
                    <Link to="/dash/chats" className="flex flex-col items-center text-white">
                        <img
                            alt="Message-icon"
                            src="https://file.rendit.io/n/P8cQrPTjOFdfN5wPuSX4.png"
                            className="w-6 h-6"
                        />
                        <span className="font-sans font-medium text-xs">Messages</span>
                    </Link>
                </div>
                <div className=''>
                    <Link to="/dash/" className="flex flex-col items-center text-white">
                        <FontAwesomeIcon icon={faHouse} />
                        <span className="font-sans font-medium text-xs">Home</span>
                    </Link>
                </div>
                <div className=''>
                    <Link to="/dash/profile" className="flex flex-col items-center text-white">
                        <img
                            alt="Profile-icon"
                            src="https://file.rendit.io/n/zTAMToJwUTu7k5AEf6hs.svg"
                            className="w-6 h-6"
                        />
                        <span className="font-sans font-medium text-xs">My Account</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashFooter;