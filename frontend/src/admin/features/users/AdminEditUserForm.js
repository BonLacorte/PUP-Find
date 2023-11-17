import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { server } from '../../../server';

const AdminEditUserForm = ({user}) => {

    const navigate = useNavigate()
    const { id } = useParams();
    const location = useLocation();
    // const user  = location.state
    console.log(`admin edit form`, user)

    const [name, setName] = useState(user.name);
    const [idNum, setIdNum] = useState(user.uid);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedMembership, setSelectedMembership] = useState(user.membership);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber)
    const [specification, setSpecification] = useState(user.specification)
    const [image, setImage] = useState();
    const [imagesPreview, setImagesPreview] = useState(user.pic.url);
    const [twitterLink, setTwitterLink] = useState(user.twitterLink)
    const [facebookLink, setFacebookLink] = useState(user.facebookLink)
    const [specificationLabel, setSpecificationLabel] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onNameChanged = (e) => setName(e.target.value);
    const onIdNumChanged = (e) => setIdNum(e.target.value);
    const onEmailChanged = (e) => setEmail(e.target.value);
    const onPhoneNumberChanged = (e) => setPhoneNumber(e.target.value);
    const onSpecificationChanged = (e) => setSpecification(e.target.value);
    const onTwitterLinkChanged = (e) => setTwitterLink(e.target.value);
    const onFacebookLinkChanged = (e) => setFacebookLink(e.target.value);
    // const onMembershipChange = (e) => setSelectedMembership(e.target.value);
    const onPasswordChanged = (e) => setPassword(e.target.value);
    const onConfirmPasswordChanged = (e) => setConfirmPassword(e.target.value);
    const onMembershipChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedMembership(selectedValue);

        // Set the specification label based on the selected membership
        switch (selectedValue) {
            case 'Student':
                setSpecificationLabel('Section: (Ex: BSIT 3-2)');
                break;
            case 'Professor':
                setSpecificationLabel('Department: (Ex: CCIS)');
                break;
            case 'Staff':
                setSpecificationLabel('Role: (Ex: Utility)');
                break;
            default:
                setSpecificationLabel('Section: (Ex: BSIT 3-2)');
                break;
        }
    };

    // Function to handle image selection
    // Handle and convert it in base 64
    const handleImageSelection = (e) => {
        const files = e.target.files;

        if (files.length > 0) {
            const file = files[0]; // Get the first selected file

            const reader = new FileReader();

            reader.onload = () => {
                // Display the selected image in a circular frame
                setImagesPreview(reader.result);
                setImage(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    // Function to trigger the file input when the circular frame is clicked
    const handleImageClick = () => {
        document.getElementById('imageInput').click();
    };

    const canEdit = [name, email, image, selectedMembership, phoneNumber, specification, twitterLink, facebookLink, password] 

    // Function to update user data
    const updateUser = async (event) => {
        event.preventDefault()
        if (isSubmitting) {
            // If the button is already submitting, ignore the click
            return;
        }
        setIsSubmitting(true);
        console.log(canEdit)
        // Check if the 'Password' and 'Confirm Password' fields match
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            toast.error("Passwords do not match");
            setIsSubmitting(false);
            return; // Stop the form submission
        } else {
            setPasswordError(''); // Reset the password error if they match

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
    
                const updatedUserData = {
                    name,
                    email,
                    uid: idNum,
                    phoneNumber: phoneNumber ? phoneNumber : null,
                    pic: image,
                    membership: selectedMembership ? selectedMembership : user.membership,
                    specification,
                    twitterLink: twitterLink ? twitterLink: null,
                    facebookLink: facebookLink ? facebookLink: null,
                    password
                };
    
                const { data } = await axios.put(`${server}/user/${id}`, updatedUserData, config);
    
                toast.success("Profile updated successfully!");
                navigate(`/admin/dash/users/`)
                console.log('User updated:', data);
            } catch (error) {
                console.log('User update failed:', error);
                toast.error(error.response.data.message);
                setIsSubmitting(false);
            }
        }
    };

    return (
        <>
            <div className='p-8 lg:p-20 w-full'>
                <div className='md:pb-4 flex flex-col sm:flex-row sm:justify-between gap-4 md:gap-0'>
                    <h1 className='text-3xl font-bold text-primaryColor'>
                    Edit User
                    </h1>

                    <div className="flex pb-2">
                        <button
                            className='bg-primaryColor text-white w-full font-bold py-2 px-2 rounded mr-2'
                        >
                            <Link to={`/admin/dash/users/`} className="">
                                See User Table
                            </Link>
                            
                        </button>
                    </div>
                </div>
                <div className="md:mx-auto lg:w-3/4 xl:w-1/2 w-full">
                    <div
                        className="w-32 h-32 rounded-full overflow-hidden cursor-pointer mx-auto relative avatar-container"
                        onClick={handleImageClick}
                    >
                        <div
                            className="absolute inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 avatar-overlay"
                        >
                            <label className="cursor-pointer text-white font-semibold">
                                Change Avatar
                                {/* <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageSelection}
                                /> */}
                            </label>
                        </div>
                        {imagesPreview && (
                            <img
                                src={imagesPreview}
                                alt="Selected Avatar"
                                className="w-full h-full object-cover"
                            />
                        )}
                        {!imagesPreview && (
                            <div className="w-full h-full bg-gray-300 flex justify-center items-center text-gray-600">
                                <span>Click to upload</span>
                            </div>
                        )}
                    </div>
                    <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageSelection}
                    />
                    {/* <div className='flex flex-row justify-center items-center'>
                        <h2 className="text-md justify-center items-center text-primaryColor">
                            *Click the image to edit user avatar
                        </h2>
                    </div> */}
                    <div className='flex flex-row justify-center items-center mb-4 mt-4'>
                        
                        <h2 className="text-2xl font-semibold mr-2">
                            I am a PUPian
                            
                        </h2>
                        <select
                            name="category"
                            id="category"
                            value={selectedMembership}
                            onChange={onMembershipChange}
                            className="bg-gray-100 border-2 px-2 py-1 rounded-lg text-primaryColor font-semibold"
                        >
                            <option value="Student">Student</option>
                            <option value="Professor">Professor</option>
                            <option value="Staff">Staff</option>
                        </select>
                    </div>
                    
                    <form onSubmit={updateUser} className=''>
                        <div className="flex flex-row w-full mb-4">
                            <div className="w-1/2 mr-4">
                                <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                    Name:
                                </label>
                                <input
                                    className="bg-gray-100 border-2 w-full px-2 py-1 "
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="off"
                                    value={name}
                                    required
                                    onChange={onNameChanged}
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                    ID Number:
                                </label>
                                <input
                                    className="bg-gray-100 border-2 w-full px-2 py-1 "
                                    id="id-no"
                                    name="id-no"
                                    type="text"
                                    autoComplete="off"
                                    value={idNum}
                                    required
                                    onChange={onIdNumChanged}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col w-full mb-4">
                            <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                Email:
                            </label>
                            <input
                                className="bg-gray-100 border-2 w-full px-2 py-1 "
                                id="name"
                                name="name"
                                type="email"
                                autoComplete="off"
                                value={email}
                                required
                                onChange={onEmailChanged}
                            />
                        </div>
                        <div className="flex flex-row w-full mb-4">
                            <div className="w-1/2 mr-4">
                                <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                    Phone number:
                                </label>
                                <input
                                    className="bg-gray-100 border-2 w-full px-2 py-1 "
                                    id="name"
                                    name="name"
                                    type="number"
                                    autoComplete="off"
                                    value={phoneNumber}
                                    required
                                    onChange={onPhoneNumberChanged}
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                    {selectedMembership === 'Student' ? 'Section: (Ex: BSIT 3-2)' : selectedMembership === 'Professor' ? 'Department: (Ex: CCIS)' : 'Role: (Ex: Utility)'}
                                </label>
                                <input
                                    className="bg-gray-100 border-2 w-full px-2 py-1 "
                                    id="id-no"
                                    name="id-no"
                                    type="text"
                                    autoComplete="off"
                                    value={specification}
                                    required
                                    onChange={onSpecificationChanged}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col w-full mb-4">
                            <label className="block mb-2" htmlFor="name">
                                Twitter link:
                            </label>
                            <input
                                className="bg-gray-100 border-2 w-full px-2 py-1 "
                                id="twt-link"
                                name="twt-link"
                                type="text"
                                autoComplete="off"
                                value={twitterLink}
                                onChange={onTwitterLinkChanged}
                            />
                        </div>
                        <div className="flex flex-col w-full mb-4">
                            <label className="block mb-2" htmlFor="name">
                                Facebook link:
                            </label>
                            <input
                                className="bg-gray-100 border-2 w-full px-2 py-1 "
                                id="fb-link"
                                name="fb-link"
                                type="text"
                                autoComplete="off"
                                value={facebookLink}
                                onChange={onFacebookLinkChanged}
                            />
                        </div>
                        <div className="flex flex-row w-full mb-8">
                            <div className="w-1/2 mr-4">
                                <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                    Password:
                                </label>
                                <input
                                    className="bg-gray-100 border-2 w-full px-2 py-1 "
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="off"
                                    value={password}
                                    required
                                    onChange={onPasswordChanged}
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                    Confirm password:
                                </label>
                                <input
                                    className="bg-gray-100 border-2 w-full px-2 py-1 "
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="off"
                                    value={confirmPassword}
                                    required
                                    onChange={onConfirmPasswordChanged}
                                />
                            </div>
                        </div>
                        <div className="text-center">
                            <button  className="bg-primaryColor text-white font-bold py-2 px-4 rounded" disabled={isSubmitting}>
                                {isSubmitting ? 'Updating User...' : 'Update User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AdminEditUserForm;
