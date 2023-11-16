import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate,  } from 'react-router-dom'
import useAdminAuth from '../../hooks/useAdminAuth'
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import PulseLoader from 'react-spinners/PulseLoader'
import { DataGrid } from "@material-ui/data-grid";

const AdminReportPage = () => {
    const { accessToken } = useAdminAuth
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()

    const [selectedReportType, setSelectedReportType] = useState('Found')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortOrder, setSortOrder] = useState('asc')
    const [sortColumn, setSortColumn] = useState('date')
    const [reportToDelete, setReportToDelete] = useState(null)
    const [reports, setReports] = useState([]) 
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const handleSort = (column) => {
        // Toggle sorting order if the same column is clicked again
        if (column === sortColumn) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            // Set the new sorting column and default to ascending order
            setSortColumn(column)
            setSortOrder('asc')
        }
    }

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
        try {
        const config = {
            headers: {
            token: `Bearer ${accessToken}`,
            },
        }
    
        await axios.delete(`http://localhost:3500/report/${reportToDelete._id}`, config)
    
        setReports((prevReports) => prevReports.filter((report) => report._id !== reportToDelete._id))
    
        onClose()
        } catch (error) {
        console.log(error)
        }
    }

    const handleExportToCSV = () => {
        const reversedSortedReports = [...sortedReports].reverse(); // Reverse the sortedReports array

        const reportsToExport = reversedSortedReports.map((report) => ({
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

    // Sorting function for the 'date' column
    const sortByCreatedAt = (a, b) => {
        if (sortOrder === 'asc') {
            return new Date(a.createdAt) - new Date(b.createdAt)
        } else {
            return new Date(b.createdAt) - new Date(a.createdAt)
        }
    }

    // Sorting function for the 'item name' column
    const sortByName = (a, b) => {
        const nameA = a.itemName.toLowerCase()
        const nameB = b.itemName.toLowerCase()

        if (sortOrder === 'asc') {
            return nameA.localeCompare(nameB)
        } else {
            return nameB.localeCompare(nameA)
        }
    }

    // Sorting function for the 'report status' column
    const sortByStatus = (a, b) => {
        const statusA = a.reportStatus.toLowerCase()
        const statusB = b.reportStatus.toLowerCase()

        if (sortOrder === 'asc') {
            return statusA.localeCompare(statusB)
        } else {
            return statusB.localeCompare(statusA)
        }
    }

    // Use a switch statement to determine which sorting function to apply
    const sortFunction = (column) => {
        switch (column) {
            case 'createdAt':
                return sortByCreatedAt
            case 'item':
                return sortByName
            case 'status':
                return sortByStatus
            default:
                return sortByCreatedAt // Default sorting
        }
    }

    // Apply sorting based on the selected column
    const sortedReports = [...reports].sort(sortFunction(sortColumn))
    
    const getTableHeaders = () => {
        return (
            <>
                <th scope="col" className="px-6 py-3 bg-customBackground text-left text-sm font-medium">
                    <button onClick={() => handleSort('item')}>
                        Item {sortColumn === 'item' && sortOrder === 'asc' && <span>▲</span>}
                        {sortColumn === 'item' && sortOrder === 'desc' && <span>▼</span>}
                    </button>
                </th>
                <th scope="col" className="px-6 py-3 bg-customBackground text-left text-sm font-medium">
                    <button onClick={() => handleSort('status')}>
                        Status {sortColumn === 'status' && sortOrder === 'asc' && <span>▲</span>}
                        {sortColumn === 'status' && sortOrder === 'desc' && <span>▼</span>}
                    </button>
                </th>
                <th scope="col" className="px-6 py-3 bg-customBackground text-left text-sm font-medium">
                    <button onClick={() => handleSort('createdAt')}>
                        {selectedReportType === 'Found' ? 'Date Reported' : 'Date Reported'} {sortColumn === 'createdAt' && sortOrder === 'asc' && <span>▲</span>}
                        {sortColumn === 'createdAt' && sortOrder === 'desc' && <span>▼</span>}
                    </button>
                </th>
                <th scope="col" className="px-6 py-3 bg-customBackground text-left text-sm font-medium">
                    Ref. Number
                </th>
                <th scope="col" className="px-6 py-3 bg-customBackground text-left text-sm font-medium">
                    Report Creator
                </th>
                <th scope="col" className="px-6 py-3 bg-customBackground text-left text-sm font-medium">
                    Action
                </th>
            </>
        )
    }

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

            let url = `http://localhost:3500/report`

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

    useEffect(() => {
        getAllReports(selectedReportType)
        setSortColumn('createdAt')
        setSortOrder('desc')
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
                <div className="p-20 w-full border-l-amber-600">
                    <div className="pb-4 flex justify-between">
                        <h1 className="text-3xl font-bold text-primaryColor">{getHeader()}</h1>
                        <div className="flex pb-2">
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
                        <table className="w-full border">
                            <thead>
                                <tr>{getTableHeaders()}</tr>
                            </thead>
                            <tbody>
                                {sortedReports.map((report) => (
                                    <tr key={report._id} className={`${
                                        new Date(report.createdAt) > new Date() - 24 * 60 * 60 * 1000
                                            ? 'bg-yellow-50'
                                            : ''
                                    } hover:bg-gray-200`}>
                                        {/* Render report data here */}
                                        <td className="px-6 py-3">
                                            <div className='flex flex-row items-center '>
                                                {report.itemImage === null || report.itemImage === undefined || report.itemImage.length === 0 ? <img src={'https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png'} alt="" className="w-10 h-10 rounded-full mr-2"/> : <img src={report.itemImage[0].url} alt="" className="w-10 h-10 rounded-full mr-2"/>}
                                                {report.itemName}        
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            {report.reportStatus === "Processing" 
                                                ? 
                                                <div className='w-max px-2 border-2 border-red-500 font-semibold text-red-500 rounded-2xl'>
                                                    <p>Processing</p>
                                                </div>
                                                : report.reportStatus === "Missing"
                                                ? 
                                                <div className='w-max px-2 border-2 border-red-500 font-semibold text-red-500 rounded-2xl'>
                                                    <p>Missing</p>
                                                </div>
                                                : report.reportStatus === "Claimable" 
                                                ?
                                                <div className='w-max px-2 border-2 border-blue-500 font-semibold text-blue-500 rounded-2xl'>
                                                    <p>Claimable</p>
                                                </div>
                                                :
                                                <div className='w-max px-2 border-2 border-green-500 font-semibold text-green-500 rounded-2xl'>
                                                    <p>Claimed</p>
                                                </div>
                                            }
                                        </td>
                                        <td className="px-6 py-3">{new Date(report.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-3">{report._id}</td>
                                        <td className="px-6 py-3">
                                                <div className='flex flex-row items-center '>
                                                    {<img src={report.creatorId.pic.url} alt="" className="w-10 h-10 rounded-full mr-2"/> || '-'}
                                                    {report.creatorId.name || '-'}
                                                </div>
                                            </td>
                                        <td className="px-6 py-3">
                                            <button
                                                onClick={() => {
                                                    navigate(selectedReportType === 'Found' ? `/admin/dash/reports/found/edit/${report._id}` : `/admin/dash/reports/missing/edit/${report._id}`, {state: { report: report}})
                                            }} className="text-blue-500 font-bold py-2 px-2 rounded mr-2">
                                                Edit
                                            </button> 
                                            
                                            <button 
                                                onClick={() => {
                                                    navigate(selectedReportType === 'Found' ? `/admin/dash/reports/found/info` : `/admin/dash/reports/missing/info`, {state: { report: report}})
                                            }} className="text-blue-500 font-bold py-2 px-2 rounded mr-2">
                                                Info
                                            </button>

                                            {selectedReportType === 'Found' && report.reportStatus === 'Claimable' ? 
                                                <button
                                                onClick={() => {
                                                    navigate(`/admin/dash/reports/found/${report._id}`, {state: { report: report}})
                                                }} className="text-blue-500 font-bold py-2 px-2 rounded mr-2">
                                                    Claim
                                                </button> : null
                                            }

                                            <button
                                                onClick={() => {
                                                    setReportToDelete(report)
                                                    onOpen() // Open the delete confirmation modal
                                                }}
                                                className="text-red-500 font-bold py-2 px-2 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                        {/* <td><h1>{report.itemImage[0]._id}</h1></td>
                                        <td><h1>{report.itemImage[0].url}</h1></td>
                                        <td><h1>{report.itemImage[0].public_id}</h1></td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                            <p>Are you sure you want to delete User {reportToDelete.name}?</p>
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