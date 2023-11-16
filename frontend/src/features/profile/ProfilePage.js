import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useSendLogoutMutation } from '../auth/authApiSlice'
import { toast } from 'react-toastify';

const ProfilePage = ({profile}) => {
    const { userId, name, accessToken } = useAuth()

    const navigate = useNavigate()

    const [sendLogout, { isLoadingLogout, isSuccessLogout, isErrorLogout, errorLogout }] = useSendLogoutMutation();

    const toggleLogout = () =>  {
        localStorage.removeItem("userInfo");
        sendLogout();
        toast.success("User successfully logged out!");
        navigate('/');
    }

    return (
        <>
            <div className="bg-white flex flex-col justify-center items-center w-full h-full border-blue-700 ">
                <div className="absolute hidden lg:flex flex-col left-0 bottom-0">
                    <img alt="" src="https://file.rendit.io/n/d4pFfFHPbtM6Gj5j2YWE.svg" className="w-20 h-16 absolute top-64 left-0" />
                    <img alt="" src="https://file.rendit.io/n/KPfOZKCRuRSFGmey9AWj.svg" className="w-12 h-56 absolute top-24 left-0" />
                    <img alt="" src="https://file.rendit.io/n/lnOSNwFIl9xHUHBhIDjt.svg" className="relative"/>
                </div>
                <section
                    className="public min-h-[90vh] flex items-center justify-center border-orange-700 w-full px-2"
                >
                    <div className="bg-white lg:bg-gray-100 bg-opacity-60 lg:backdrop-filter lg:backdrop-blur-lg lg:rounded-xl lg:shadow-md min-h-max w-full lg:w-3/5 border-green-700 px-10 ">
                        <h1 className="text-3xl font-bold my-4 ">
                            Your Profile
                        </h1>
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="flex justify-center items-center w-full">
                                <img src={profile.pic.url} alt="Profile" className="flex justify-center items-center lg:hidden w-40 h-40 rounded-full" />
                            </div>
                            <div className="flex items-center">
                                <img src={profile.pic.url} alt="Profile" className="hidden lg:flex w-20 h-20 rounded-full mr-4" />
                                <div>
                                    <h2 className="text-xl font-semibold">{profile.name}</h2>
                                    <p className="text-gray-600">{profile.email}</p>
                                </div>
                            </div>
                            <div className="">
                                <h3 className="text-lg font-semibold">Additional Information</h3>
                                <div className="mt-3">
                                    <p className="text-gray-700">Phone Number: {profile.phoneNumber || 'N/A'}</p>
                                    <p className="text-gray-700">Membership: {profile.membership || 'N/A'}</p>
                                    <p className="text-gray-700">Specification: {profile.specification || 'N/A'}</p>
                                    <div className="flex mt-3">
                                        {profile.facebookLink && <a href={profile.facebookLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mr-4">Facebook</a>}
                                        {profile.twitterLink && <a href={profile.twitterLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Twitter</a>}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="border-primaryColor bg-primaryColor mt-6 flex flex-col justify-center items-center rounded-md py-2 px-4">
                                    <Link to={`/dash/profile/edit/${userId}`}  className="text-white text-center text-sm md:text-lg font-semibold">
                                        Edit Profile
                                    </Link>
                                </div>
                                <div className="border-primaryColor bg-primaryColor mt-6 flex flex-col justify-center items-center rounded-md py-2 px-4">
                                    <button
                                        className="text-white text-center text-sm md:text-lg font-semibold"
                                        role="menuitem"
                                        onClick={toggleLogout}
                                        >
                                        Logout
                                    </button>
                                </div>
                            </div>
                            

                        </div>
                    </div>
                </section>
                <img alt="" src="https://file.rendit.io/n/6pqpGxjbbyM1B8AnjoDp.svg" className="hidden lg:flex w-[111px] h-40 absolute top-24 right-40"/>
                <div className="absolute hidden lg:flex flex-col w-56 items-start right-0 bottom-0">
                    <img alt=""
                        src="https://file.rendit.io/n/AyZ958KVZDdkvBnClSIZ.svg"
                        className="w-40 h-40 absolute top-16 left-16 overflow-hidden"
                        id="Ellipse"
                    />
                    <img alt=""
                        src="https://file.rendit.io/n/52Gyzn7j1eB4irdFrXjv.svg"
                        className="w-32 h-[286px] absolute top-24 left-24"
                        id="Ellipse1"
                    />
                    <img alt=""
                        src="https://file.rendit.io/n/i41HWlHDYSfHPajsbj4O.svg"
                        className="relative"
                        id="Ellipse2"
                    />
                </div>
            </div>
        </>
    )
}

export default ProfilePage