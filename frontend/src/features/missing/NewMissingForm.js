import React, { useState } from 'react'
import { Locations } from '../config/Locations';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { ChatState } from '../../context/ChatProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { server } from '../../server';

const NewMissingForm = () => {

    const currentDate = new Date().toISOString().split('T')[0];
    const {accessToken, userId, name} = useAuth();
    const { selectedChat, setSelectedChat, chats, setChats, selectedReport, setSelectedReport } = ChatState();
    const navigate = useNavigate()

    const [itemName, setItemName] = useState("");
    const [dateFound, setDateFound] = useState("");
    const [selectedLocation, setSelectedLocation] = useState('Choose Location');
    const [itemDescription, setItemDescription] = useState("");
    const [image, setImage] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [reportType, setReportType] = useState("MissingReport")
    const [reportStatus, setReportStatus] = useState("Missing")
    const [loadingChat, setLoadingChat] = useState(false)
    const [newAddedFoundReport, setNewAddedFoundReport] = useState(null)

    const onItemNameChanged = (e) => setItemName(e.target.value);
    const onDateFound = (e) => setDateFound(e.target.value);
    const onLocationChanged = (e) => setSelectedLocation(e.target.value);
    const onDescriptionChanged = (e) => setItemDescription(e.target.value);

    //handle and convert it in base 64
    const handleImage = (e) =>{

        const files = Array.from(e.target.files);

        console.log("files:", files);
        // Empty the image array (reset)
        setImage([]);
        setImagesPreview([]);

        if (files === 0) return setImage(null)
        files.forEach((file) => {
            const reader = new FileReader();
        
            reader.onload = () => {
                if (reader.readyState === 2) {
                setImagesPreview((old) => [...old, reader.result]);
                setImage((old) => [...old, reader.result]);
                }
            };
        
            reader.readAsDataURL(file);
        });
    }

    const options = Object.values(Locations).map(location => {
        return (
            <option
                key={location}
                value={location}
            > 
                {location}
            </option >
        )
    })

    const canSave = [itemName, itemDescription, dateFound, selectedLocation !== 'Choose Location', image,] 

    const addReport = async (event) => {
        event.preventDefault()
        console.log(`cansave`,canSave)
        console.log(`name`,name)
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    token: `Bearer ${accessToken}`,
                },
            };
            
            const { data } = await axios.post(`${server}/report/`,
                {
                    itemName: itemName, 
                    itemDescription: itemDescription, 
                    date: dateFound, 
                    location: selectedLocation, 
                    image,
                    creatorId: userId,
                    reportStatus,
                    reportType,
                },
            config
            );

            console.log(`New Found Item - data 1`,data)
            setNewAddedFoundReport(data)
            toast.success("Found report created successfully!");
            fetchChats()
        } catch (error) {
            console.log(error)
            console.log('NewReportForm')
            toast.error(error.response.data.message);
        };
    }

    const fetchChats = async () => {
        // FetchChats
        try {
            const config = {
            headers: {
                token: `Bearer ${accessToken}`,
                },
            };

            const { data } = await axios.get(`${server}/chat`,
            config);
            console.log(`data from FetchChats = data `, data)
            await setChats(data);
            console.log(`data from FetchChats = chats `,chats)
        } catch (err) {
            console.log(`${err} - in FetchChats`)
        }
        
        // HandleAccessChat
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                "Content-type": "application/json",
                token: `Bearer ${accessToken}`,
                },
            };
        
            const { data } = await axios.post(`${server}/chat`,{}, config);
            console.log(`data from HandleAccessChat = data`, data)
        
            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats])
            }
            
            console.log(`List of Chats`,chats)
        
            await setSelectedChat(data)
            console.log(`setSelectedChat1`, setSelectedChat)
            console.log(`setSelectedChat2 ${setSelectedChat}`)
            setLoadingChat(false)
            if (loadingChat === false) {
                navigate(`/dash/chats`)
            }
            
        } catch (err) {
            console.log(`${err} - in HandleAccessChat`)
        }
    }

    return (
        <div className="bg-white flex flex-col justify-center items-center w-screen border-blue-700">
            <div className="absolute hidden lg:flex flex-col left-0 bottom-0">
                <img alt="" src="https://file.rendit.io/n/d4pFfFHPbtM6Gj5j2YWE.svg" className="w-20 h-16 absolute top-64 left-0" />
                <img alt="" src="https://file.rendit.io/n/KPfOZKCRuRSFGmey9AWj.svg" className="w-12 h-56 absolute top-24 left-0" />
                <img alt="" src="https://file.rendit.io/n/lnOSNwFIl9xHUHBhIDjt.svg" className="relative"/>
            </div>
            <section
                className="public min-h-screen flex items-center justify-center border-orange-700 w-full"
            >
                {/* <div className="flex flex-col justify-center items-center w-3/5 border border-blue-700"> */}
                <div className="bg-gray-100 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl shadow-md min-h-screen w-screen lg:w-3/5 border-green-700 px-10 ">
                    <h1 className="text-3xl font-bold my-4">
                        Report your missing item
                    </h1>
                    <div className="items-start">
                        {/* <div className="border-solid border-[#dde1e6] bg-white relative flex flex-col justify-center mb-[301px] gap-6 w-[655px] items-start pt-4 pb-5 px-4 border"> */}
                        <div className="border-solid font-semibold flex flex-col justify-center w-full border">
                            <form className="p-4 flex flex-col" onSubmit={addReport}>
                                <div className="text-lg font-sans font-bold">
                                    <h1 className='text-lg'>
                                        Missing Item detail
                                    </h1>
                                </div>
                                <div className="lg:flex flex-row hidden lg:w-full">
                                    <div className="hidden lg:w-1/2 mr-4">
                                        <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                            Item Name:
                                        </label>
                                        <input
                                            className="border border-gray-300 p-2 rounded-md w-full"
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoComplete="off"
                                            value={itemName}
                                            required
                                            onChange={onItemNameChanged}
                                        />
                                    </div>
                                    <div className="hidden lg:w-1/2 ">
                                        <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                            Date Missing:
                                        </label>
                                        <input
                                            className="border border-gray-300 p-2 rounded-md w-full"
                                            id="name"
                                            name="name"
                                            type="date"
                                            max={currentDate}
                                            value={dateFound}
                                            required
                                            onChange={onDateFound}
                                        />
                                    </div>
                                </div>
                                <div className='w-full mt-4'>
                                    <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                        Item Name:
                                    </label>
                                    <input
                                        className="border border-gray-300 p-2 rounded-md w-full"
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="off"
                                        value={itemName}
                                        required
                                        onChange={onItemNameChanged}
                                    />
                                </div>
                                <div className='w-full mt-4'>
                                    <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                        Date Missing:
                                    </label>
                                    <input
                                        className="border border-gray-300 p-2 rounded-md w-full"
                                        id="name"
                                        name="name"
                                        type="date"
                                        max={currentDate}
                                        value={dateFound}
                                        required
                                        onChange={onDateFound}
                                    />
                                </div>
                                <div className='w-full mt-4'>
                                    <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                        Possible Location Lost:
                                    </label>
                                    <select
                                        name="location"
                                        id="location"
                                        value={selectedLocation}
                                        onChange={onLocationChanged}
                                        required
                                        className="border border-gray-300 p-2 rounded-md w-full"
                                    >
                                        <option>
                                            Choose Location
                                        </option>
                                        {options}
                                    </select>
                                </div>
                                <div className="w-full mt-4">
                                    <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                        Item Description:
                                    </label>
                                    <textarea className="border border-gray-300 p-2 rounded-md w-full"
                                        id="description"
                                        name="description"
                                        rows={4}
                                        value={itemDescription}
                                        required
                                        onChange={onDescriptionChanged}
                                    />
                                </div>
                                <div className="w-full mt-2">
                                    <label className="block mb-2" htmlFor="image">
                                        Item Image:
                                    </label>
                                    <input
                                        className="border border-gray-300 p-2 rounded-md w-full"
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImage}
                                        multiple
                                    />

                                    <div className="grid grid-cols-3 gap-4 py-2">
                                        {imagesPreview.map((image, index) => (
                                            <img className="w-full h-auto object-contain" key={index} src={image} alt="Product Preview" />
                                        ))}
                                    </div>
                                </div>

                                <button className="border-solid border-primaryColor bg-primaryColor font-semibold py-2 px-4 rounded-md w-full mt-4 text-white">
                                        Submit report
                                </button>
                                
                            </form>
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
    )
}

export default NewMissingForm