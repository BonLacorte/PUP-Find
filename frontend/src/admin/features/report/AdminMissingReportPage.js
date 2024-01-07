import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate,  } from 'react-router-dom'
import useAdminAuth from '../../hooks/useAdminAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import { useTable, useSortBy, usePagination } from "react-table";
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    chakra
} from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';
import { server } from '../../../server'

const AdminMissingReportPage = () => {

    const { accessToken } = useAdminAuth
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()

    const [searchQuery, setSearchQuery] = useState('')
    const [reportToDelete, setReportToDelete] = useState(null)
    const [reports, setReports] = useState([]) 
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true) 

    // CSS styles for the table container
    const tableContainerStyles = {
        overflowX: 'auto',
        maxWidth: '100%',
        width: '100%',
        // minWidth: '600px', // Set the minimum width for the table
    };

    const handleSearchChange = (e) => {
        const query = e.target.value
        setSearchQuery(query)
        // Call fetchUsers with updated searchQuery and selected category
        getAllReports(query)
    }

    const handleDeleteReport = async () => {
        // console.log(`clicked delete button`,reportToDelete)
        try {
        const config = {
            headers: {
            token: `Bearer ${accessToken}`,
            },
        }
    
        await axios.delete(`${server}/report/${reportToDelete.id}`, config)
    
        setReports((prevReports) => prevReports.filter((report) => report._id !== reportToDelete._id))
    
        onClose()
        toast.success("Missing report deleted successfully!");
        window.location.reload()
        } catch (error) {
        // console.log(error)
        toast.error(error.response.data.message);
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

        const csvContent = csvData.map((row) => row.join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const reportType = 'Missing'
        const currentDate = new Date().toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' })
        a.download = `PUPFind-${reportType}-Reports-as-of-${currentDate}.csv`
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getAllReports = async (query) => {
        let reportTypeUrl = 'MissingReport'
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    token: `Bearer ${accessToken}`,
                },
            }

            let url = `${server}/report`

            if (reportTypeUrl) url += `?reportType=${reportTypeUrl}`
            // console.log('reportType',url)

            if (query) url += reportTypeUrl ? `&search=${query}` : `?search=${query}`
            // console.log('reportType and query',url)
            const { data } = await axios.get(url, config) // Replace with your API endpoint
            
            const filteredData = data.filter((report) => report.reportStatus !== 'Claimed')
            setReports(filteredData)
            // console.log(`missing data`,data)
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    const columns = React.useMemo(
        () => [
        {
            accessor: 'itemName',
            Header: 'Item',
            Cell: (params) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={params.row.original.image} alt="" className="w-10 h-10 rounded-full mr-2" />
                        {params.row.original.itemName}
                    </div>
                );
            },
        },
        {
            accessor: 'reportStatus',
            Header: 'Status',
            Cell: (params) => {
                return (
                    <div>
                        <div className='flex justify-center border-2 border-red-500 font-semibold text-red-500 rounded-2xl'>
                            <p>Missing</p>
                        </div>
                    </div>
                );
            },
        },
        {
            accessor: 'createdAt',
            Header: 'Date Reported',
            Cell: (params) => {
                return new Date(params.row.original.createdAt).toLocaleDateString();
            }
        },
        {
            accessor: 'id',
            Header: 'Ref. Number',
        },
        {
            accessor: 'creatorId',
            Header: 'Report Creator',
            Cell: (params) => {
                return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={params.row.original.creatorPic} alt="" className="w-10 h-10 rounded-full mr-2" />
                    {params.row.original.creatorName}
                </div>
                )
            },
        },
        {
            accessor: 'actions',
            Header: 'Action',
            minWidth: 150, flex: 0.7,
            sortable: false,
            Cell: (params) => (
                <>
                    <button
                        onClick={() => {
                            navigate(`/admin/dash/reports/missing/edit/${params.row.original.id}`, {state: { report: params.row.original}})
                    }} className="bg-blue-500 text-white font-bold py-2 px-2 rounded mr-2 border 
                    hover:bg-blue-700 transition duration-200">
                        Edit
                    </button> 
                    
                    
                    <button
                        onClick={() => {
                            setReportToDelete(params.row.original)
                            // console.log(`delete click`, params.row.original)
                            onOpen() // Open the delete confirmation modal
                        }}
                        className="
                        bg-red-500 text-white font-bold py-2 px-2 rounded mr-2 border
                        hover:bg-red-700 transition duration-200"
                    >
                        Delete
                    </button>
                    <button 
                        onClick={() => {
                            navigate(`/admin/dash/reports/missing/info`, {state: { report: params.row.original}})
                            // // console.log(`admin report page`,params.row)
                    }} className="bg-blue-500 text-white font-bold py-2 px-2 rounded mr-2 border 
                    hover:bg-blue-700 transition duration-200">
                        Info
                    </button>
                </>
            ),
        },
    ],[]
    )

    const row = React.useMemo(
        () =>
            reports.map((item) => {
                // console.log(`item`,item)
            const images = item.itemImage && item.itemImage.length > 0 ? item.itemImage.map(image => ({
                public_id: image.public_id,
                url: image.url,
            })) : null;
            return {
                creatorName: item.creatorId.uid,
                creatorPic: item.creatorId.pic.url,
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
            };
        }),
    [reports]
);

    // // console.log(`row`,row)

    useEffect(() => {
        getAllReports()
        // eslint-disable-next-line
    }, [])

    const { 
        getTableProps, 
        getTableBodyProps, 
        headerGroups, 
        page, 
        prepareRow, 
        canPreviousPage, 
        canNextPage, 
        pageOptions, 
        pageCount, 
        gotoPage, 
        nextPage, 
        previousPage, 
        state: { pageIndex, pageSize },
    } = useTable(
        { 
            columns, 
            data: row,
            initialState: { pageIndex: 0, pageSize: 10 },
        }, 
            useSortBy,
            usePagination
        );
    
    // Displayed data range
    const displayedDataRange = `${pageIndex * pageSize + 1}-${Math.min(
        (pageIndex + 1) * pageSize,
        row.length
    )} of ${row.length}`;


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
                <div className="p-8 lg:p-20 w-full rounded-lg border">
                    <div className="md:pb-4 flex flex-col md:flex-row md:justify-between gap-4 md:gap-0">
                        <h1 className="text-3xl font-bold text-primaryColor">Missing Reports</h1>
                        <div className="flex flex-col md:flex-row gap-2 md:gap-0">
                            <button
                                className='bg-primaryColor text-white w-full font-bold py-2 px-4 rounded mr-2'
                                onClick={handleExportToCSV}
                            >
                                Export to CSV
                            </button>
                            <button className="bg-primaryColor text-white w-full font-bold py-2 px-2 rounded mr-2">
                                <Link to={`/admin/dash/reports/missing/new`}>
                                    {`Add Missing Report`}
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
                            {/* <select
                                name="category"
                                id="category"
                                value={selectedReportType}
                                onChange={handleCategoryChange}
                                className="bg-gray-100 border-2 w-full px-2 py-1 rounded-lg"
                            >
                            <option value="Found">Found Items</option>
                            <option value="Missing">Missing Items</option>
                            </select> */}
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-full pt-1 mt-5 lg:mt-10 bg-white border" style={tableContainerStyles}>
                            <Table {...getTableProps()}>
                                <Thead>
                                    {headerGroups.map((headerGroup) => (
                                    <Tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => (
                                        <Th
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            isNumeric={column.isNumeric}
                                        >
                                            {column.render('Header')}
                                            <chakra.span pl="4">
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                <TriangleDownIcon aria-label="sorted descending" />
                                                ) : (
                                                <TriangleUpIcon aria-label="sorted ascending" />
                                                )
                                            ) : null}
                                            </chakra.span>
                                        </Th>
                                        ))}
                                    </Tr>
                                    ))}
                                </Thead>
                                <Tbody {...getTableBodyProps()}>
                                    {page.map((row) => {
                                        prepareRow(row);
                                        return (
                                            <Tr {...row.getRowProps()}>
                                            {row.cells.map((cell) => (
                                                <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                                                {cell.render('Cell')}
                                                </Td>
                                            ))}
                                            </Tr>
                                        );
                                    })}
                                </Tbody>
                            </Table>

                            {/* Pagination */}
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => previousPage()}
                                    disabled={!canPreviousPage}
                                    className="bg-primaryColor text-white font-bold py-2 px-4 rounded mr-2 cursor-pointer
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => nextPage()}
                                    disabled={!canNextPage}
                                    className="bg-primaryColor text-white font-bold py-2 px-4 rounded cursor-pointer
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>

                            {/* Displayed data range text */}
                            <p className="text-center mt-2">
                                {displayedDataRange}
                            </p>
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

export default AdminMissingReportPage