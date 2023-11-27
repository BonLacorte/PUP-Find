import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ProfilePage from './ProfilePage';
import useAuth from '../../hooks/useAuth';
import { server } from '../../server';
import PulseLoader from 'react-spinners/PulseLoader';

const ProfilePageLoad = () => {

    const { userId, name, accessToken } = useAuth()

    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState()

    const fetchInfo = async () => {
        try {
            const config = {
            headers: {
                token: `Bearer ${accessToken}`,
            },
        };

        const { data } = await axios.get(`${server}/user/${userId}`, config);
        console.log(data)
        setProfile(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchInfo()
    }, []);

    const content = profile ? <ProfilePage profile={profile}/> :
        <div className="w-full h-screen flex items-center justify-center">
            <div className="flex justify-center">
                <PulseLoader  color={"#000"} />
            </div>
        </div>
    return content
}

export default ProfilePageLoad