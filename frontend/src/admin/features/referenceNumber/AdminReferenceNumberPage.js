import React, { useEffect, useState } from 'react'
import useAdminAuth from '../../hooks/useAdminAuth';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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
import { server } from '../../../server';

const AdminReferenceNumberPage = () => {
    const {accessToken, userId, name} = useAdminAuth;
    const navigate = useNavigate()

    const [selectedCategoryReport, setSelectedCategoryReport] = useState('Student');
    const [searchQuery, setSearchQuery] = useState('');
    const [claimedReports, setClaimedReports] = useState([])
    const [sortOrder, setSortOrder] = useState('asc'); // Initial sorting order
    const [sortColumn, setSortColumn] = useState('dateClaimed');

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [claimedReportToDelete, setClaimedReportToDelete] = useState(null);
    const [claimedReportToDownload, setClaimedReportToDownload] = useState(null);

    // CSS styles for the table container
    const tableContainerStyles = {
        overflowX: 'auto',
        maxWidth: '100%',
        width: '100%',
    };

    const handleSort = (column) => {
        // Toggle sorting order if the same column is clicked again
        if (column === sortColumn) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // Set the new sorting column and default to ascending order
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        // Call fetchUsers with updated searchQuery and selected category
        getAllClaimedReports(query);
    };

    const handleDeleteClaimedReport = async () => {
        
        try {
            const config = {
                headers: {
                token: `Bearer ${accessToken}`,
                },
            };
            
            // // console.log(`claimedReportToDelete.id`, claimedReportToDelete.id)
            // Send a DELETE request to your API to delete the report
            const { data } = await axios.delete(`${server}/claimedReport/${claimedReportToDelete.id}`, config);
        
            // Remove the deleted user from the users array
            // setClaimedReports((prevClaimedReports) => prevClaimedReports.filter((claimedReport) => claimedReport.id !== claimedReportToDelete._id));
        
            // Close the delete confirmation modal
            onClose()
            toast.success("Claimed report deleted successfully!");
            window.location.reload()
        } catch (error) {
            // console.log(error);
            toast.error(error.response.data.message);
        }
    };

    // Create a function to fetch all reports
    const getAllClaimedReports = async (query) => {
        
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    token: `Bearer ${accessToken}`,
                },
            };

            let url = `${server}/claimedReport`;

            // Add search query as query parameters

            if (query) {
                url +=  `?search=${query}`;
            }
            // console.log(url)
            const { data } = await axios.get(url, config); // Replace with your API endpoint

            setClaimedReports(data); // Set the reports in state
            // console.log(data)
        } catch (error) {
            console.error(error);
        }
    };

    const columns = React.useMemo(
        () => [
        {
            accessor: 'itemDetails', // Use a custom field name
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
            // accessor: 'reportStatus',
            Header: 'Status',
            Cell: (params) => {
                return (
                    <div>
                        <div className='flex justify-center border-2 border-green-500 font-semibold text-green-500 rounded-3xl'>
                            <p>Claimed</p>
                        </div>
                    </div>
                );
            },
        },
        {
            accessor: 'id',
            Header: 'Ref. Number',
        },
        {
            accessor: 'createdAt',
            Header: 'Date Claimed',
            Cell: (params) => {
                return new Date(params.row.original.createdAt).toLocaleDateString();
            }
        },
        {
            accessor: 'actions',
            Header: 'Action',
            Cell: (params) => (
                <div>
                    <button
                        onClick={() => {
                            navigate(`/admin/dash/referenceNumber/info/`, { state: { claimedReport: params.row.original } });
                            // // console.log(`admin report page`,params.row.original)
                        }}
                        // className="text-blue-500 font-bold py-2 px-2 rounded mr-2 border"
                        className="bg-blue-500 text-white font-bold py-2 px-2 rounded mr-2 border 
                        hover:bg-blue-700 transition duration-200"
                        
                    >
                        Info
                    </button>
                    <button
                        onClick={() => {
                            setClaimedReportToDelete(params.row.original);
                            // console.log(`claimedReportToDelete`, claimedReportToDelete)
                            // // console.log(`claimedReportToDelete id`, claimedReportToDelete.id)
                            onOpen();
                        }}
                        className="
                        bg-red-500 text-white font-bold py-2 px-2 rounded mr-2 border
                        hover:bg-red-700 transition duration-200"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => {
                            setClaimedReportToDownload(params.row.original);
                            navigate(`/admin/dash/referenceNumber/download/`, { state: { claimedReport: params.row.original } });
                        }}
                        className="bg-green-500 text-white font-bold py-2 px-2 rounded mr-2 border hover:bg-green-700 transition duration-200"
                    >
                        Download
                    </button>
                </div>
            ),
        },
    ],[]
    )

    const row = React.useMemo(
        () => 
        claimedReports.map((item) => {
        // // console.log(`item`,item)
        const images = item.foundReport.itemImage && item.foundReport.itemImage.length > 0 ? item.foundReport.itemImage.map(image => ({
            public_id: image.public_id,
            url: image.url,
        })) : null;
        return {
            image: images && images.length > 0 ? images[0].url : 'https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png',
            itemName: item.foundReport.itemName, // Add this line to include the itemName property
            id: item._id, 
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            foundReport: {
                creator:{
                    id: item.foundReport.creator._id,
                    name: item.foundReport.creator.name,
                    uid: item.foundReport.creator.uid,
                    email: item.foundReport.creator.email,
                    phoneNumber: item.foundReport.creator.phoneNumber,
                    membership: item.foundReport.creator.membership,
                    specification: item.foundReport.creator.specification,
                    facebookLink: item.foundReport.creator.facebookLink,
                    twitterLink: item.foundReport.creator.twitterLink,
                    pic:
                    {
                        public_id: item.foundReport.creator.pic.public_id,
                        url: item.foundReport.creator.pic.url,
                    }
                },
                itemImage: images,
                itemDescription: item.foundReport.itemDescription,
                itemName: item.foundReport.itemName,
                location: item.foundReport.location,
                date: item.foundReport.date,
                reportStatus: item.foundReport.reportStatus,
                reportType: item.foundReport.reportType,
                id: item.foundReport._id, 
            },
            missingReport: {
                creator:{
                    id: item.missingReport.creator.id,
                    name: item.missingReport.creator.name,
                    uid: item.missingReport.creator.uid,
                    email: item.missingReport.creator.email,
                    phoneNumber: item.missingReport.creator.phoneNumber,
                    membership: item.missingReport.creator.membership,
                    specification: item.missingReport.creator.specification,
                    facebookLink: item.missingReport.creator.facebookLink,
                    twitterLink: item.missingReport.creator.twitterLink,
                    pic:
                    {
                        public_id: item.missingReport.creator.pic.public_id,
                        url: item.missingReport.creator.pic.url,
                    }
                },
                itemImage: item.missingReport.itemImage && item.missingReport.itemImage.length > 0 ? [{
                    public_id: item.missingReport.itemImage[0].public_id,
                    url: item.missingReport.itemImage[0].url,
                }] : null,
                itemDescription: item.missingReport.itemDescription,
                itemName: item.missingReport.itemName,
                location: item.missingReport.location,
                date: item.missingReport.date,
                reportStatus: item.missingReport.reportStatus,
                reportType: item.missingReport.reportType,
                id: item.missingReport._id, 
            }
        }
    }),
    [claimedReports]
);

    // // console.log(`row`,row)

    // Use useEffect to fetch all reports when the component mounts
    useEffect(() => {
        getAllClaimedReports();
        // eslint-disable-next-line
    }, []);

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

    const handleExportToCSV = () => {
        const reversedClaimedReports = [...claimedReports].reverse(); // Reverse the sortedReports array

        const reportsToExport = reversedClaimedReports.map((report) => ({
            Item: report.foundReport.itemName,
            'Report Status': "Claimed",
            'Date Claimed': new Date(report.createdAt).toLocaleDateString(),
            'Ref. Number': report._id,
            'Founder Name': report.foundReport.creator.name || '-',
            'Founder UID': report.foundReport.creator.uid || '-',
            'Owner Name': report.missingReport.creator.name || '-',
            'Owner UID': report.missingReport.creator.uid || '-',
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
        const currentDate = new Date().toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' });
        a.download = `PUPFind-ClaimedReports-as-of-${currentDate}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const content = (
        <>
            <div className='p-8 lg:p-20 w-full rounded-lg border'>
                <div className='md:pb-4 flex flex-col md:flex-row md:justify-between gap-4 md:gap-0'>
                    <h1 className='text-3xl font-bold text-primaryColor'>Claimed Reports</h1>

                    <div className="flex flex-col md:flex-row gap-2 md:gap-0">
                        <button
                            className='bg-primaryColor text-white w-full font-bold py-2 px-4 rounded mr-2'
                            onClick={handleExportToCSV}
                        >
                            Export to CSV
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
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="w-full pt-1 mt-5 lg:mt-10 bg-white">
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
                    <ModalHeader>Delete Claimed Report</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {claimedReportToDelete && (
                        <p>Are you sure you want to delete this Claimed Report code {claimedReportToDelete.id}?</p>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" onClick={handleDeleteClaimedReport}>Delete</Button>
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )

    return content
}

export default AdminReferenceNumberPage