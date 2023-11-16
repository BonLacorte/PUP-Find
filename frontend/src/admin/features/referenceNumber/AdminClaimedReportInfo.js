import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';

const AdminClaimedReportInfo = () => {

    const location = useLocation();
    const claimedReport  = location.state // Provide a default value if location.state is null

    console.log(claimedReport)

    const [selectedMissingImage, setSelectedMissingImage] = useState(null);
    const [itemFirstMissingImage, setItemFirstMissingImage] = useState( claimedReport.claimedReport.missingReportId.itemImage === null || claimedReport.claimedReport.missingReportId.itemImage === undefined || claimedReport.claimedReport.missingReportId.itemImage.length === 0 ? 'https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png' : claimedReport.claimedReport.missingReportId.itemImage[0].url)
    const [oldMissingImage, setOldMissingImage] = useState(claimedReport.claimedReport.missingReportId.itemImage === null || claimedReport.claimedReport.missingReportId.itemImage === undefined || claimedReport.claimedReport.missingReportId.itemImage.length === 0 ? [] : claimedReport.claimedReport.missingReportId.itemImage);

    
    const [selectedFoundImage, setSelectedFoundImage] = useState(null);
    const [itemFirstFoundImage, setItemFirstFoundImage] = useState(claimedReport.claimedReport.foundReportId.itemImage === null || claimedReport.claimedReport.foundReportId.itemImage === undefined || claimedReport.claimedReport.foundReportId.itemImage.length === 0 ? 'https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png' : claimedReport.claimedReport.foundReportId.itemImage[0].url)
    const [oldFoundImage, setOldFoundImage] = useState(claimedReport.claimedReport.foundReportId.itemImage === null || claimedReport.claimedReport.foundReportId.itemImage === undefined || claimedReport.claimedReport.foundReportId.itemImage.length === 0 ? [] : claimedReport.claimedReport.foundReportId.itemImage);

    const content = claimedReport && claimedReport.claimedReport ? 
        claimedReport ? 
        <>
            <div className="p-20 w-full border-l-amber-600">
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
                            <h1 className="text-2xl font-bold">{claimedReport.claimedReport.missingReportId.itemName}</h1>
                            </p>
                            <p className="mb-2">
                            <span className="font-bold">Date Found:</span> {new Date(claimedReport.claimedReport.missingReportId.date).toISOString().slice(0, 10)}
                            </p>
                            <p className="mb-2">
                            <span className="font-bold">Founded in:</span> {claimedReport.claimedReport.missingReportId.location}
                            </p>
                            <p className="mb-2">
                            <span className="font-bold">Description:</span> {claimedReport.claimedReport.missingReportId.itemDescription}
                            </p>
                        </div>

                        <div className='p-4'>
                            <div className='flex flex-row justify-between'>
                                <p className="mb-2">
                                    <span className="font-bold">Owner Information:</span>
                                </p>
                            </div>
                            <div className='flex flex-row justify-start'>
                                <img
                                        src={claimedReport.claimedReport.missingReportId.creatorId.pic.url}
                                        alt=""
                                        className="w-12 rounded-lg mb-2"
                                />
                                <div className='flex flex-col mx-2'>
                                    <p className="mb-2">
                                        <span className="font-bold">{claimedReport.claimedReport.missingReportId.creatorId.name}</span>
                                    </p>
                                    <p className="mb-2">
                                        <span className="font-bold">{claimedReport.claimedReport.missingReportId.creatorId.membership}</span>
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
                                <img className="w-auto h-auto object-contain" src={ claimedReport.claimedReport.missingReportId.itemImage === null || claimedReport.claimedReport.missingReportId.itemImage.length === 0 ? 'https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png' : itemFirstMissingImage } alt="" />
                            </div>
                            )}
                            {selectedMissingImage && (
                            <div className='flex h-full w-full justify-center'>
                                {/* // <h2>Selected Image:</h2> */}
                                <img className="w-auto h-full object-contain" src={claimedReport.claimedReport.missingReportId.itemImage === null || claimedReport.claimedReport.missingReportId.itemImage.length === 0 ? 'https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png' : selectedMissingImage} alt="Selected Product Preview" />
                            </div>
                            )}
                        </div>
                        
                        <div className='flex justify-center '>
                            <div className="grid grid-cols-5 gap-4 p-4">
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

                <div className=" rounded-lg  flex flex-col lg:flex-row p-10">
                    <div className="w-full lg:w-1/2 p-4 lg:border-r border-gray-400">
                    {/* Lost Item info */}

                        <div className='p-4 border-b border-gray-400'>
                            <p className="mb-2">
                            <h1 className="text-3xl font-bold">Found Report</h1>
                            </p>
                            <p className="mb-2">
                            <h1 className="text-2xl font-bold">{claimedReport.claimedReport.foundReportId.itemName}</h1>
                            </p>
                            <p className="mb-2">
                            <span className="font-bold">Date Found:</span> {new Date(claimedReport.claimedReport.foundReportId.date).toISOString().slice(0, 10)}
                            </p>
                            <p className="mb-2">
                            <span className="font-bold">Founded in:</span> {claimedReport.claimedReport.foundReportId.location}
                            </p>
                            <p className="mb-2">
                            <span className="font-bold">Description:</span> {claimedReport.claimedReport.foundReportId.itemDescription}
                            </p>
                        </div>

                        <div className='p-4'>
                            <div className='flex flex-row justify-between'>
                                <p className="mb-2">
                                    <span className="font-bold">Owner Information:</span>
                                </p>
                            </div>
                            <div className='flex flex-row justify-start'>
                                <img
                                        src={claimedReport.claimedReport.foundReportId.creatorId.pic.url}
                                        alt=""
                                        className="w-12 rounded-lg mb-2"
                                />
                                <div className='flex flex-col mx-2'>
                                    <p className="mb-2">
                                        <span className="font-bold">{claimedReport.claimedReport.foundReportId.creatorId.name}</span>
                                    </p>
                                    <p className="mb-2">
                                        <span className="font-bold">{claimedReport.claimedReport.foundReportId.creatorId.membership}</span>
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
                                <img className="w-auto h-auto object-contain" src={ claimedReport.claimedReport.foundReportId.itemImage === null || claimedReport.claimedReport.foundReportId.itemImage.length === 0 ? 'https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png' : itemFirstFoundImage } alt="" />
                            </div>
                            )}
                            {selectedFoundImage && (
                            <div className='flex h-full w-full justify-center'>
                                {/* // <h2>Selected Image:</h2> */}
                                <img className="w-auto h-full object-contain" src={ claimedReport.claimedReport.foundReportId.itemImage === null || claimedReport.claimedReport.foundReportId.itemImage.length === 0 ? 'https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png' : selectedFoundImage} alt="Selected Product Preview" />
                            </div>
                            )}
                        </div>
                        
                        <div className='flex justify-center '>
                            <div className="grid grid-cols-5 gap-4 p-4">
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
        : <p>Loading...</p> 
        :
        <div>
            <p>Data not available. Please navigate through the appropriate route.</p>
        </div> 

    return content
}

export default AdminClaimedReportInfo