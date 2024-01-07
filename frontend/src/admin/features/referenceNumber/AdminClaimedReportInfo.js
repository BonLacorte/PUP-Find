import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import PulseLoader from 'react-spinners/PulseLoader';

const AdminClaimedReportInfo = () => {

    const location = useLocation();
    const claimedReport  = location.state // Provide a default value if location.state is null

    // console.log(claimedReport)

    const [selectedMissingImage, setSelectedMissingImage] = useState(null);
    const [itemFirstMissingImage, setItemFirstMissingImage] = useState( claimedReport.claimedReport.missingReport.itemImage === null || claimedReport.claimedReport.missingReport.itemImage === undefined || claimedReport.claimedReport.missingReport.itemImage.length === 0 ? 'https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png' : claimedReport.claimedReport.missingReport.itemImage[0].url)
    const [oldMissingImage, setOldMissingImage] = useState(claimedReport.claimedReport.missingReport.itemImage === null || claimedReport.claimedReport.missingReport.itemImage === undefined || claimedReport.claimedReport.missingReport.itemImage.length === 0 ? [] : claimedReport.claimedReport.missingReport.itemImage);

    
    const [selectedFoundImage, setSelectedFoundImage] = useState(null);
    const [itemFirstFoundImage, setItemFirstFoundImage] = useState(claimedReport.claimedReport.foundReport.itemImage === null || claimedReport.claimedReport.foundReport.itemImage === undefined || claimedReport.claimedReport.foundReport.itemImage.length === 0 ? 'https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png' : claimedReport.claimedReport.foundReport.itemImage[0].url)
    const [oldFoundImage, setOldFoundImage] = useState(claimedReport.claimedReport.foundReport.itemImage === null || claimedReport.claimedReport.foundReport.itemImage === undefined || claimedReport.claimedReport.foundReport.itemImage.length === 0 ? [] : claimedReport.claimedReport.foundReport.itemImage);

    const content = claimedReport && claimedReport.claimedReport ? 
        claimedReport ? 
        <>
            <div className="p-20 w-full rounded-lg border">
                <div className="pb-4 flex justify-between">
                    <h1 className="text-3xl font-bold text-primaryColor">Claimed Report Info</h1>
            
                    <div className="flex pb-2">
                        
                        <button className="bg-primaryColor text-white w-full font-bold py-2 px-2 rounded mr-2">
                            <Link to={`/admin/dash/referenceNumber/`}>
                                See Claimed Reports Table
                            </Link>
                        </button>
                    </div>
                </div>

                <div className=" rounded-lg flex flex-col lg:flex-row p-10">
                    <div className="w-full lg:w-1/2 p-4 lg:border-r border-gray-400">
                    {/* Lost Item info */}

                        <div className='p-4 border-b border-gray-400'>
                            <p className="mb-2">
                            <h1 className="text-3xl font-bold">Missing Report</h1>
                            </p>
                            <p className="mb-2">
                            <h1 className="text-2xl font-bold">{claimedReport.claimedReport.missingReport.itemName}</h1>
                            </p>
                            <p className="mb-2">
                            <span className="font-bold">Date lost:</span> {new Date(claimedReport.claimedReport.missingReport.date).toISOString().slice(0, 10)}
                            </p>
                            <p className="mb-2">
                            <span className="font-bold">Possible lost at:</span> {claimedReport.claimedReport.missingReport.location}
                            </p>
                            <p className="mb-2">
                            <span className="font-bold">Description:</span> {claimedReport.claimedReport.missingReport.itemDescription}
                            </p>
                        </div>

                        <div className='p-4'>
                            <div className='flex flex-row justify-between'>
                                <p className="mb-2">
                                    <span className="font-bold">User Information:</span>
                                </p>
                            </div>
                            <div className='flex flex-row justify-start'>
                                <img
                                        src={claimedReport.claimedReport.missingReport.creator.pic.url}
                                        alt=""
                                        className="w-12 rounded-lg mb-2"
                                />
                                <div className='flex flex-col mx-2'>
                                    <p className="mb-2">
                                        <span className="font-bold">{claimedReport.claimedReport.missingReport.creator.name.length > 10 ? `${claimedReport.claimedReport.missingReport.creator.name.substring(0, 10)}...` : claimedReport.claimedReport.missingReport.creator.name}</span>
                                    </p>
                                    <p className="mb-2">
                                        <span className="font-bold">{claimedReport.claimedReport.missingReport.creator.membership}</span>
                                    </p>
                                </div>
                                <div className='flex flex-col mx-2'>
                                    <p className="mb-2">
                                        <span className="font-bold">{claimedReport.claimedReport.missingReport.creator.email}</span>
                                    </p>
                                    <p className="mb-2">
                                        <span className="font-bold">{claimedReport.claimedReport.missingReport.creator.specification}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 p-4 flex justify-center items-center flex-col ">
                        <div className='h-80 w-full flex justify-center border border-gray-400'>
                            {!selectedMissingImage && (
                            <div className='flex h-auto w-auto justify-center'>
                                {/* // <h2>Selected Image:</h2> */}
                                <img className="w-auto h-auto object-contain" src={ claimedReport.claimedReport.missingReport.itemImage === null || claimedReport.claimedReport.missingReport.itemImage.length === 0 ? 'https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png' : itemFirstMissingImage } alt="" />
                            </div>
                            )}
                            {selectedMissingImage && (
                            <div className='flex h-full w-full justify-center'>
                                {/* // <h2>Selected Image:</h2> */}
                                <img className="w-auto h-full object-contain" src={claimedReport.claimedReport.missingReport.itemImage === null || claimedReport.claimedReport.missingReport.itemImage.length === 0 ? 'https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png' : selectedMissingImage} alt="Selected Product Preview" />
                            </div>
                            )}
                        </div>
                        
                        <div className='flex justify-center '>
                        <div className=" border-blue-600 w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:p-4">
                            {oldMissingImage !== null 
                            ?   oldMissingImage.map((image, index) => (
                                <img
                                    className="w-24 h-auto object-contain cursor-pointer"
                                    key={index}
                                    src={image.url}
                                    alt="itemImage"
                                    onClick={() => setSelectedMissingImage(image.url)}
                                />
                                ))
                            : <img
                                className="w-24 h-auto object-contain cursor-pointer"
                                src={oldMissingImage}
                                alt="itemImage"
                            />}
                            </div>
                        </div>
                    </div>
                </div> 

                <div className="rounded-lg flex flex-col lg:flex-row p-10">
                    <div className="w-full lg:w-1/2 p-4 lg:border-r border-gray-400">
                    {/* Lost Item info */}

                        <div className='p-4 border-b border-gray-400'>
                            <p className="mb-2">
                            <h1 className="text-3xl font-bold">Found Report</h1>
                            </p>
                            <p className="mb-2">
                            <h1 className="text-2xl font-bold">{claimedReport.claimedReport.foundReport.itemName}</h1>
                            </p>
                            <p className="mb-2">
                            <span className="font-bold">Date Found:</span> {new Date(claimedReport.claimedReport.foundReport.date).toISOString().slice(0, 10)}
                            </p>
                            <p className="mb-2">
                            <span className="font-bold">Found at:</span> {claimedReport.claimedReport.foundReport.location}
                            </p>
                            <p className="mb-2">
                            <span className="font-bold">Description:</span> {claimedReport.claimedReport.foundReport.itemDescription}
                            </p>
                        </div>

                        <div className='p-4'>
                            <div className='flex flex-row justify-between'>
                                <p className="mb-2">
                                    <span className="font-bold">User Information:</span>
                                </p>
                            </div>
                            <div className='flex flex-row justify-start'>
                                <img
                                        src={claimedReport.claimedReport.foundReport.creator.pic.url}
                                        alt=""
                                        className="w-12 rounded-lg mb-2"
                                />
                                <div className='flex flex-col mx-2'>
                                    <p className="mb-2">
                                        <span className="font-bold">{claimedReport.claimedReport.foundReport.creator.name.length > 10 ? `${claimedReport.claimedReport.foundReport.creator.name.substring(0, 10)}...` : claimedReport.claimedReport.foundReport.creator.name}</span>
                                    </p>
                                    <p className="mb-2">
                                        <span className="font-bold">{claimedReport.claimedReport.foundReport.creator.membership}</span>
                                    </p>
                                </div>
                                <div className='flex flex-col mx-2'>
                                    <p className="mb-2">
                                        <span className="font-bold">{claimedReport.claimedReport.foundReport.creator.email}</span>
                                    </p>
                                    <p className="mb-2">
                                        <span className="font-bold">{claimedReport.claimedReport.foundReport.creator.specification}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 p-4 flex justify-center items-center flex-col ">
                        <div className='h-80 w-full flex justify-center border border-gray-400'>
                            {!selectedFoundImage && (
                            <div className='flex h-auto w-auto justify-center'>
                                {/* // <h2>Selected Image:</h2> */}
                                <img className="w-auto h-auto object-contain" src={ claimedReport.claimedReport.foundReport.itemImage === null || claimedReport.claimedReport.foundReport.itemImage.length === 0 ? 'https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png' : itemFirstFoundImage } alt="" />
                            </div>
                            )}
                            {selectedFoundImage && (
                            <div className='flex h-full w-full justify-center'>
                                {/* // <h2>Selected Image:</h2> */}
                                <img className="w-auto h-full object-contain" src={ claimedReport.claimedReport.foundReport.itemImage === null || claimedReport.claimedReport.foundReport.itemImage.length === 0 ? 'https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png' : selectedFoundImage} alt="Selected Product Preview" />
                            </div>
                            )}
                        </div>
                        
                        <div className='flex justify-center '>
                            <div className="w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:p-4">
                            {oldFoundImage !== null 
                            ?   oldFoundImage.map((image, index) => (
                                <img
                                    className="w-24 h-auto object-contain cursor-pointer"
                                    key={index}
                                    src={image.url}
                                    alt="itemImage"
                                    onClick={() => setSelectedFoundImage(image.url)}
                                />
                                ))
                            : <img
                                className="w-24 h-auto object-contain cursor-pointer"
                                src={oldFoundImage}
                                alt="itemImage"
                            />}
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </>
        : 
            <div className="w-full h-screen flex items-center justify-center">
                <div className="flex justify-center">
                    <PulseLoader  color={"#000"} />
                </div>
            </div>
        :
        <div>
            <p>Data not available. Please navigate through the appropriate route.</p>
        </div> 

    return content
}

export default AdminClaimedReportInfo