import React, { useEffect, useState } from 'react'
import useAdminAuth from '../../hooks/useAdminAuth'
import axios from 'axios'
import AdminNewUserForm from './AdminNewUserForm'
import AdminEditUserForm from './AdminEditUserForm'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import PulseLoader from 'react-spinners/PulseLoader'
import { DataGrid } from "@material-ui/data-grid";
import { toast } from 'react-toastify';
import { server } from '../../../server'

const AdminUsersPage = () => {
    const { accessToken } = useAdminAuth()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()

    const [selectedCategoryReport, setSelectedCategoryReport] = useState('Student')
    const [searchQuery, setSearchQuery] = useState('')
    const [showAddUserForm, setShowAddUserForm] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [userToDelete, setUserToDelete] = useState(null)
    const [users, setUsers] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const handleCategoryChange = (e) => {
        setSelectedCategoryReport(e.target.value)
        getAllUsers(e.target.value, searchQuery)
    }
    
    const handleSearchChange = (e) => {
        const query = e.target.value
        setSearchQuery(query)
        getAllUsers(selectedCategoryReport, query)
    }

    const handleAddUser = () => {
        setEditingUser(null)
        setShowAddUserForm(true)
    }

    const handleExportToCSV = () => {
        const usersToExport = users.map((user) => ({
            Name: user.name,
            Id: user.uid,
            Specification: user.specification,
            Membership: user.membership,
            Email: user.email,
            Contact: user.phoneNumber || '-',
            'Twitter Link': user.twitterLink || '-',
            'Facebook Link': user.facebookLink || '-',
        }));
    
        const csvData = [];
        csvData.push(Object.keys(usersToExport[0])); // Add header row
    
        usersToExport.forEach((user) => {
            csvData.push(Object.values(user));
        });
    
        const csvContent = csvData.map((row) => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const currentDate = new Date().toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' });
        a.download = `PUPFind-Users-as-of-${currentDate}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleUpdateUser = (updatedUserData) => {
        // Update the user data in the users array
        setUsers((prevUsers) => {
            const updatedUsers = prevUsers.map((user) => {
                if (user._id === updatedUserData._id) {
                    return updatedUserData
                }
                return user
            })
            return updatedUsers
        })

        setEditingUser(null)
        setShowAddUserForm(false)
    }

    const handleDeleteUser = async () => {
        console.log(`clicked delete button`,userToDelete)
        try {
            const config = {
                headers: {
                token: `Bearer ${accessToken}`,
                },
            }
            
            await axios.delete(`${server}/user/${userToDelete.id}`, config)

            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userToDelete._id))
            onClose()
            toast.success("User account deleted successfully!");
            window.location.reload()
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
        } finally {}
    }

    const getAllUsers = async (category, query) => {
        try {
            const config = {
                headers: {
                    token: `Bearer ${accessToken}`,
                },
            }

            let url = `${server}/user/`

            if (category) url += `?category=${category}`

            if (query) url += category ? `&search=${query}` : `?search=${query}`

            const { data } = await axios.get(url, config)
            setUsers(data)
        } catch (error) {
            setError(error)
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllUsers(selectedCategoryReport)
        // eslint-disable-next-line
    }, [])

    const columns = [
        // { field: 'id', headerName: 'Id', minWidth: 150, flex: 0.7 },
        { 
            field: 'name', 
            headerName: 'Name', 
            minWidth: 150, 
            flex: 0.7,
            renderCell: (params) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={params.row.image} alt="" className="w-10 h-10 rounded-full mr-2" />
                        {params.row.name}
                    </div>
                );
            },
        },
        { field: 'uid', headerName: 'Id', minWidth: 150, flex: 0.7 },
        { field: 'specification', headerName: 'Section/Department/Role', minWidth: 150, flex: 0.7 },
        { field: 'email', headerName: 'Email', minWidth: 150, flex: 0.7 },
        { field: 'phoneNumber', headerName: 'Contact', minWidth: 150, flex: 0.7 },
        {
            field: 'actions',
            headerName: 'Action',
            minWidth: 150, flex: 0.7,
            renderCell: (params) => (
                <>
                    <button 
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
                    </button>
                </>
            ),
        },
    ];

    const row = [];

    users &&
        users.forEach((item) => {
            console.log(`item`,item)
            row.push({
                image: item.pic.url,
                id: item._id, 
                name: item.name,
                uid: item.uid,
                specification: item.specification,
                email: item.email,
                phoneNumber: item.phoneNumber,
                pic:
                {
                    public_id: item.pic.public_id,
                    url: item.pic.url,
                }
            });
        });

    // console.log(`row`,row)

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
                <div className='p-8 lg:p-20 w-full'>
                    <div className='md:pb-4 flex flex-col md:flex-row md:justify-between gap-4 md:gap-0'>
                        <h1 className='text-3xl font-bold text-primaryColor'>
                            {editingUser ? 'Edit User' : showAddUserForm ? 'Create an Account' : 'Users'}
                        </h1>
    
                        <div className="flex flex-col md:flex-row gap-2 md:gap-0">
                            {/* <div className='flex justify-end mt-4'> */}
                                <button
                                    className='bg-primaryColor text-white w-full font-bold py-2 px-4 rounded mr-2'
                                    onClick={handleExportToCSV}
                                >
                                    Export to CSV
                                </button>
                            {/* </div> */}

                            <button
                                onClick={() => {
                                    setShowAddUserForm(!showAddUserForm)
                                    setEditingUser(null)
                                    navigate(`/admin/dash/users/new`,)
                                }}
                                className='bg-primaryColor text-white w-full font-bold py-2 px-2 rounded mr-2'
                            >
                                    Add New User
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
                                value={selectedCategoryReport}
                                onChange={handleCategoryChange}
                                className="bg-gray-100 border-2 w-full px-2 py-1 rounded-lg"
                            >
                                <option value="Student">Student</option>
                                <option value="Professor">Professor</option>
                                <option value="Staff">Staff</option>
                            </select>
                                
                        </div>
                    </div>
                    {showAddUserForm ? (
                        <AdminNewUserForm onAddUser={handleAddUser} />
                    ) : editingUser ? (
                        <AdminEditUserForm user={editingUser} onUpdateUser={handleUpdateUser} />
                    ) : (
                        // <div className="flex justify-center">
                            // <div className="flex flex-col">
                                <div className="w-full pt-1 mt-5 lg:mt-10 bg-white">
                                    <DataGrid rows={row} columns={columns} disableSelectionOnClick
                autoHeight pageSize={10}/>
                                </div>
                            // </div> 
                        // </div>
                    )}
                </div>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Delete User</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {userToDelete && (
                                <p>Are you sure you want to delete User {userToDelete.name}?</p>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="red" onClick={handleDeleteUser}>Delete</Button>
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        );
    }
    return content 
};
export default AdminUsersPage
