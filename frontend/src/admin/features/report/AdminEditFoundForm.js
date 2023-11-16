import React, { useState } from 'react'
import useAdminAuth from '../../hooks/useAdminAuth';
import { Locations } from '../../../features/config/Locations';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { server } from '../../../server';

const AdminEditFoundForm = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const {accessToken, userId, name} = useAdminAuth;

    const location = useLocation();
    const report  = location.state

    const navigate = useNavigate()

    const [itemName, setItemName] = useState(report.report.itemName);
    const [dateFound, setDateFound] = useState(new Date(report.report.date).toISOString().slice(0, 10));
    const [selectedLocation, setSelectedLocation] = useState(report.report.location);
    const [itemDescription, setItemDescription] = useState(report.report.itemDescription);
    const [image, setImage] = useState(null);
    const [oldImage, setOldImage] = useState(report.report.itemImage);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [reportType, setReportType] = useState("FoundReport")
    const [reportStatus, setReportStatus] = useState(report.report.reportStatus)
    const [creatorId, setCreatorId] = useState(report.report.creatorId.uid);

    const onItemNameChanged = (e) => setItemName(e.target.value);
    const onDateFound = (e) => setDateFound(e.target.value);
    const onLocationChanged = (e) => setSelectedLocation(e.target.value);
    const onDescriptionChanged = (e) => setItemDescription(e.target.value);
    const onCreatorIdChanged = (e) => setCreatorId(e.target.value);
    const onReportStatustChanged = (e) => setReportStatus(e.target.value);

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

    const canSaveFoundReport = [itemName, itemDescription, dateFound, selectedLocation !== 'Choose Location', image, reportType, reportStatus] 

    // // Function to check if idNum matches any user's UID
    // const findUserIdByUid = (uid) => {
    //     const user = users.find((user) => user.uid === uid);
    //     return user ? user._id : null;
    // };

    const editReport = async (event) => {
        event.preventDefault()
        console.log(canSaveFoundReport)
        console.log("canSaveFoundReport")

        // Check if the entered UID exists in users and get the _id
        // const creatorId = findUserIdByUid(idNum);

        // if (!creatorId) {
        //     console.log('User with this UID does not exist.');
        // return;
        // }

        console.log(name)
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    token: `Bearer ${accessToken}`,
                },
            };
            
            const { data } = await axios.put(`${server}/report/${report.report.id}`,
                {
                    itemName, 
                    itemDescription, 
                    date: dateFound, 
                    location: selectedLocation, 
                    image,
                    creatorId,
                    reportStatus,
                    reportType
                },
            config
            );

            console.log(`Edit Found Item 1- data `,data)
            toast.success("Found report updated successfully!");
            navigate(`/admin/dash/reports/found`)
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
        };
    }

    const consoleLogs = () => {
        console.log(report)
    }

    return (
        <>
            <div className='p-8 lg:p-20 w-full'>
                <div className='md:pb-4 flex flex-col md:flex-row md:justify-between gap-4 md:gap-0'>
                    <h1 className='text-3xl font-bold text-primaryColor'>
                        Edit a Found Report
                    </h1>

                    <div className="flex pb-2">
                        <button
                            className='bg-primaryColor text-white w-full font-bold py-2 px-2 rounded mr-2'
                        >
                            <Link to={`/admin/dash/reports/found`}>
                                See Reports Table
                            </Link>
                            
                        </button>
                    </div>
                </div>
                <div className="md:mx-auto lg:w-3/4 xl:w-1/2 w-full">
                    <form className="p-4 flex flex-col" onSubmit={editReport}>
                    {/* <form className="p-4 flex flex-col"> */}
                        <div className="flex flex-row w-full">
                            <div className="w-1/2 mr-4">
                                <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                    Item Name:
                                </label>
                                <input
                                    className="bg-gray-100 border-2 w-full px-2 py-1 "
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="off"
                                    value={itemName}
                                    required
                                    onChange={onItemNameChanged}
                                />
                            </div>
                            <div className="w-1/2 ">
                                <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                    Date Found:
                                </label>
                                <input
                                    className="bg-gray-100 border-2 w-full p-2 py-1 "
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
                        <div className="flex flex-row w-full mt-4">
                            <div className='w-1/2 mr-4'>
                                <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                    Location Found:
                                </label>
                                <select
                                    name="location"
                                    id="location"
                                    value={selectedLocation}
                                    onChange={onLocationChanged}
                                    required
                                    className="bg-gray-100 border-2 w-full px-2 py-1 "
                                >
                                    <option>
                                        Choose Location
                                    </option >
                                    {options}
                                </select>
                            </div>
                            <div className='w-1/2 '>
                            <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                    Report Creator's UID:
                                </label>
                                <input
                                    className="bg-gray-100 border-2 w-full px-2 py-1 "
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="off"
                                    value={creatorId}
                                    onChange={onCreatorIdChanged}
                                    required
                                    disabled
                                />
                            </div>
                        </div>
                        
                        <div className="w-full mt-4">
                            <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                Item Description:
                            </label>
                            <textarea className="bg-gray-100 border-2 w-full px-2 py-1 "
                                id="description"
                                name="description"
                                required
                                rows={4}
                                value={itemDescription}
                                onChange={onDescriptionChanged}
                            />
                        </div>
                        <div className="flex flex-row w-full mt-4">
                            <div className='w-1/2 mr-4'>
                                <label className="block mb-2" htmlFor="image">
                                Item Image:
                                </label>
                                <input
                                    className="bg-gray-100 border-2 w-full px-2 py-1"
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImage}
                                    multiple
                                />
                            </div>
                            <div className='w-1/2'>
                                <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                    Report Status:
                                </label>
                                <select
                                    name="status"
                                    id="status"
                                    value={reportStatus}
                                    onChange={onReportStatustChanged}
                                    required
                                    className="bg-gray-100 border-2 w-full px-2 py-2 "
                                >
                                    <option>
                                        Claimable
                                    </option >
                                    <option>
                                        Processing
                                    </option >
                                </select>
                            </div>
                        </div>
                        <div className="w-full mt-2">
                            {/* <label className="block mb-2" htmlFor="image"><span className='text-red-500'>*</span>
                            Item Image:
                            </label>
                            <input
                                className="bg-gray-100 border-2 w-full px-2 py-1"
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                                multiple
                            /> */}

                            <label className="block mb-2" htmlFor="image">
                                Old images:
                            </label>
                            <div className="grid grid-cols-3 gap-4 py-2">
                                {oldImage && oldImage.map((image, index) => (
                                    <img className="w-full h-auto object-contain" key={index} src={image.url} alt="Product Preview" />
                                ))}
                            </div>

                            <label className="block mb-2" htmlFor="image">
                                New images:
                                </label>
                            <div className="grid grid-cols-3 gap-4 py-2">
                                {imagesPreview.map((image, index) => (
                                    <img className="w-full h-auto object-contain" key={index} src={image} alt="Product Preview" />
                                ))}
                            </div>
                        </div>

                        <button className="border-solid border-primaryColor bg-primaryColor flex flex-col justify-center h-12 shrink-0 items-center border-2 mt-4 font-sans font-medium tracking-[0.5] leading-[16px] text-white">
                            Submit changes
                        </button>
                        
                    </form>
                    {/* <button className="border-solid border-primaryColor bg-primaryColor flex flex-col justify-center h-12 shrink-0 items-center border-2 mt-4" onClick={consoleLogs}>
                        Testing
                    </button> */}
                </div>
            </div>
        </>
    )
}

export default AdminEditFoundForm