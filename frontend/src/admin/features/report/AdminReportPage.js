import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate,  } from 'react-router-dom'
import useAdminAuth from '../../hooks/useAdminAuth'
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import PulseLoader from 'react-spinners/PulseLoader'
import { DataGrid } from "@material-ui/data-grid";
import { server } from '../../../server'

const AdminReportPage = () => {
    const { accessToken } = useAdminAuth
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()

    const [selectedReportType, setSelectedReportType] = useState('Found')
    const [searchQuery, setSearchQuery] = useState('')
    const [reportToDelete, setReportToDelete] = useState(null)
    const [reports, setReports] = useState([]) 
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const handleCategoryChange = (e) => {
        setSelectedReportType(e.target.value)
        getAllReports(e.target.value, searchQuery)
    }    

    const handleSearchChange = (e) => {
        const query = e.target.value
        setSearchQuery(query)
        // Call fetchUsers with updated searchQuery and selected category
        getAllReports(selectedReportType, query)
    }

    const handleDeleteReport = async () => {
        console.log(`clicked delete button`,reportToDelete)
        try {
        const config = {
            headers: {
            token: `Bearer ${accessToken}`,
            },
        }
    
        await axios.delete(`${server}/report/${reportToDelete.id}`, config)
    
        setReports((prevReports) => prevReports.filter((report) => report._id !== reportToDelete._id))
    
        onClose()
        window.location.reload()
        } catch (error) {
        console.log(error)
        }
    }

    const handleExportToCSV = () => {
        const reversedReports = [...reports].reverse(); // Reverse the sortedReports array

        const reportsToExport = reversedReports.map((report) => ({
            Item: report.itemName,
            'Report Status': report.reportStatus,
            'Date Reported': new Date(report.createdAt).toLocaleDateString(),
            'Ref. Number': report._id,
            'Report Creator': report.creatorId.name || '-',
            'Report Type': report.reportType
        }));
    
        const csvData = [];
        csvData.push(Object.keys(reportsToExport[0])); // Add header row
    
        reportsToExport.forEach((report) => {
            csvData.push(Object.values(report));
        });

        const csvContent = csvData.map((row) => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const reportType = selectedReportType === 'Found' ? 'Found' : 'Missing';
        const currentDate = new Date().toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' });
        a.download = `PUPFind - ${reportType} Reports - ${currentDate}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getAddButtonLink = () => {
        if (selectedReportType === 'Found') {
          return '/admin/dash/reports/found/new' // Link for adding a found report
        } else if (selectedReportType === 'Missing') {
          return '/admin/dash/reports/missing/new' // Link for adding a missing report
        }
    }
        
    const getHeader = () => {
        if (selectedReportType === 'Found') {
            return 'Found Reports'
        } else if (selectedReportType === 'Missing') {
            return 'Missing Reports'
        }
    }

    const getAllReports = async (reportType, query) => {
        let reportTypeUrl = null
        reportType === 'Found' ? reportTypeUrl = 'FoundReport' : reportTypeUrl = 'MissingReport'
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    token: `Bearer ${accessToken}`,
                },
            }

            let url = `${server}/report`

            if (reportTypeUrl) url += `?reportType=${reportTypeUrl}`

            if (query) url += reportTypeUrl ? `&search=${query}` : `?search=${query}`

            const { data } = await axios.get(url, config) // Replace with your API endpoint
            
            const filteredData = data.filter((report) => report.reportStatus !== 'Claimed')
            setReports(filteredData)
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    const columns = [
        {
            field: 'itemName',
            headerName: 'Item',
            minWidth: 150, flex: 0.7,
            sortable: true,
            renderCell: (params) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={params.row.image} alt="" className="w-10 h-10 rounded-full mr-2" />
                        {params.row.itemName}
                    </div>
                );
            },
        },
        {
            field: 'reportStatus',
            headerName: 'Status',
            minWidth: 150, flex: 0.7,
            sortable: true,
        },
        {
            field: 'createdAt',
            headerName: 'Date Reported',
            minWidth: 150, flex: 0.7,
            sortable: true,
            valueFormatter: (params) => {
                return new Date(params.value).toLocaleDateString();
            },
        },
        {
            field: 'id',
            headerName: 'Ref. Number',
            minWidth: 150, flex: 0.7,
        },
        {
            field: 'creatorId',
            headerName: 'Report Creator',
            minWidth: 150, flex: 0.7,
            valueFormatter: (params) => {
                return params.value.name || '-';
            },
        },
        {
            field: 'actions',
            headerName: 'Action',
            minWidth: 150, flex: 0.7,
            sortable: false,
            renderCell: (params) => (
                <>
                    {/* <button 
                        onClick={() => {
                            // console.log('user', params.row)
                            // console.log('id', params.row.id)
                            navigate(`/admin/dash/users/edit/${params.row.id}`, {state: { user: params.row}})
                        }} 
                        className='text-blue-500 font-bold py-2 px-2 rounded mr-2'
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => {
                            setUserToDelete(params.row)
                            onOpen()
                        }}
                        className="text-red-500 font-bold py-2 px-2 rounded"
                    >
                        Delete
                    </button> */}
                    <button
                        onClick={() => {
                            navigate(selectedReportType === 'Found' ? `/admin/dash/reports/found/edit/${params.row.id}` : `/admin/dash/reports/missing/edit/${params.row.id}`, {state: { report: params.row}})
                    }} className="text-blue-500 font-bold py-2 px-2 rounded mr-2">
                        Edit
                    </button> 
                    
                    <button 
                        onClick={() => {
                            navigate(selectedReportType === 'Found' ? `/admin/dash/reports/found/info` : `/admin/dash/reports/missing/info`, {state: { report: params.row}})
                            // console.log(`admin report page`,params.row)
                    }} className="text-blue-500 font-bold py-2 px-2 rounded mr-2">
                        Info
                    </button>

                    {selectedReportType === 'Found' && params.row.reportStatus === 'Claimable' ? 
                        <button
                        onClick={() => {
                            navigate(`/admin/dash/reports/found/${params.row.id}`, {state: { report: params.row}})
                        }} className="text-blue-500 font-bold py-2 px-2 rounded mr-2">
                            Claim
                        </button> : null
                    }

                    <button
                        onClick={() => {
                            setReportToDelete(params.row)
                            console.log(`delete click`, params.row)
                            onOpen() // Open the delete confirmation modal
                        }}
                        className="text-red-500 font-bold py-2 px-2 rounded"
                    >
                        Delete
                    </button>
                </>
            ),
        },
    ];

    const row = [];

    reports &&
    reports.forEach((item) => {
        // console.log(`item`,item)
        const images = item.itemImage && item.itemImage.length > 0 ? item.itemImage.map(image => ({
            public_id: image.public_id,
            url: image.url,
        })) : null;
        row.push({
            image: images && images.length > 0 ? images[0].url : 'https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png',
            itemName: item.itemName,
            itemDescription: item.itemDescription,
            reportStatus: item.reportStatus,
            reportType: item.reportType,
            createdAt: item.createdAt,
            id: item._id, 
            phoneNumber: item.phoneNumber,
            creatorId:{
                name: item.creatorId.name,
                uid: item.creatorId.uid,
                email: item.creatorId.email,
                phoneNumber: item.creatorId.phoneNumber,
                membership: item.creatorId.membership,
                specification: item.creatorId.specification,
                facebookLink: item.creatorId.facebookLink,
                twitterLink: item.creatorId.twitterLink,
                pic:
                {
                    public_id: item.creatorId.pic.public_id,
                    url: item.creatorId.pic.url,
                }
            },
            itemImage: images,
            location: item.location,
            date: item.date
        });
    });

    // console.log(`row`,row)

    useEffect(() => {
        getAllReports(selectedReportType)
        // eslint-disable-next-line
    }, [])

    let content

    if (error) {
        content = (
            <div className="p-20 w-full flex justify-center">
                <p className="flex justify-center">{error}</p>
            </div>
            
        )
    }

    if (loading === true) {
        content = (
            <div className="p-20 w-full flex justify-center">
                <PulseLoader color={"#000"} />
            </div>
        )
    } else {
        content = (
            <>
                <div className="p-8 lg:p-20 w-full">
                    <div className="md:pb-4 flex flex-col md:flex-row md:justify-between gap-4 md:gap-0">
                        <h1 className="text-3xl font-bold text-primaryColor">{getHeader()}</h1>
                        <div className="flex flex-col md:flex-row gap-2 md:gap-0">
                            <button
                                className='bg-primaryColor text-white w-full font-bold py-2 px-4 rounded mr-2'
                                onClick={handleExportToCSV}
                            >
                                Export to CSV
                            </button>
                            <button className="bg-primaryColor text-white w-full font-bold py-2 px-2 rounded mr-2">
                                <Link to={getAddButtonLink()}>
                                    {`Add ${selectedReportType} Report`}
                                </Link>
                            </button>
                            <input
                                type="text"
                                name="search"
                                id="search"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="bg-gray-100 border-2 w-full px-2 py-1 rounded-lg mr-2"
                            />
                            <select
                                name="category"
                                id="category"
                                value={selectedReportType}
                                onChange={handleCategoryChange}
                                className="bg-gray-100 border-2 w-full px-2 py-1 rounded-lg"
                            >
                            <option value="Found">Found Items</option>
                            <option value="Missing">Missing Items</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-full pt-1 mt-5 lg:mt-10 bg-white">
                            <DataGrid
                                rows={row}
                                columns={columns}
                                pageSize={10}
                                disableSelectionOnClick
                                autoHeight
                                // onRowClick={(params) => {
                                //     navigate(
                                //         selectedReportType === 'Found'
                                //             ? `/admin/dash/reports/found/edit/${params.row._id}`
                                //             : `/admin/dash/reports/missing/edit/${params.row._id}`,
                                //         { state: { report: params.row } }
                                //     );
                                // }}
                            />
                        </div>
                    </div>
                </div>
                {/* Delete Confirmation Modal */}
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Delete User</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {reportToDelete && (
                            <p>Are you sure you want to delete Report {reportToDelete.itemName}?</p>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="red" onClick={handleDeleteReport}>Delete</Button>
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        )
    }

    return content
}

export default AdminReportPage