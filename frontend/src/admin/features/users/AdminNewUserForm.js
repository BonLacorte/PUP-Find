import React, { useState } from 'react';
import useAdminAuth from '../../hooks/useAdminAuth';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { server } from '../../../server';
import { useNavigate } from 'react-router-dom';

const AdminNewUserForm = () => {

    const navigate = useNavigate()
    const {accessToken, userId} = useAdminAuth();

    const [name, setName] = useState("");
    const [idNum, setIdNum] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedMembership, setSelectedMembership] = useState('Student');
    const [phoneNumber, setPhoneNumber] = useState("")
    const [specification, setSpecification] = useState("")
    const [image, setImage] = useState("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
    const [imagesPreview, setImagesPreview] = useState();
    const [twitterLink, setTwitterLink] = useState("")
    const [facebookLink, setFacebookLink] = useState("")
    const [specificationLabel, setSpecificationLabel] = useState('Section: (Ex: BSIT 3-2)');
    const [passwordError, setPasswordError] = useState('');

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
        const file = e.target.files[0];

        if (file) {
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

    const canSave = [name, email, image, selectedMembership, phoneNumber, specification, twitterLink, facebookLink, password] 

    // Create user
    const createUser = async (event) => {
        console.log(canSave)
        event.preventDefault();
        
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            toast.error("Passwords do not match");
            return; // Stop the form submission
        } else {
            setPasswordError(''); // Reset the password error if they match
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        token: `Bearer ${accessToken}`,
                    },
                }
                const { data } = await axios.post(`${server}/user/new/new`, {
                    name,
                    email,
                    uid: idNum,
                    password,
                    pic: image,
                    membership: selectedMembership,
                    phoneNumber,
                    specification,
                    twitterLink,
                    facebookLink
                }, 
                config
                );
                console.log('User registered:', data);
                toast.success("User account created successfully!");
                navigate(`/admin/dash/users`)
            } catch (error) {
                console.log('User registration failed:', error);
                toast.error(error.response.data.message);
            }
        }
    }

    return (
        <>
            <div className='p-20 w-full border-l-amber-600'>
                <div className='pb-4 flex justify-between'>
                    <h1 className='text-3xl font-bold text-primaryColor'>
                        Create an Account
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
                <div className=" mx-auto w-1/2 ">
                    <div
                        className="w-32 h-32 rounded-full overflow-hidden cursor-pointer mx-auto relative avatar-container"
                        onClick={handleImageClick}
                    >
                        <div
                            className="absolute inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 avatar-overlay"
                        >
                            <label className="cursor-pointer text-white font-semibold">
                                Choose Avatar
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
                            <div className="w-full h-full bg-gray-300 flex justify-center items-center text-gray-600 font-semibold">
                                <span>Choose Avatar</span>
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
                    <div className='flex flex-row justify-center items-center mb-4'>
                        
                        <h2 className="text-2xl font-semibold mr-2">I am a PUPian</h2>
                        <select
                            name="membership"
                            id="membership"
                            value={selectedMembership}
                            onChange={onMembershipChange}
                            className="bg-gray-100 border-2 px-2 py-1 rounded-lg text-primaryColor font-semibold"
                        >
                            <option value="Student">Student</option>
                            <option value="Professor">Professor</option>
                            <option value="Staff">Staff</option>
                        </select>
                    </div>
                    
                    <form onSubmit={createUser} className=''>
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
                                <label className="block mb-2" htmlFor="name"><span className='text-red-500'>*</span>{specificationLabel}</label>
                                <input
                                    className="bg-gray-100 border-2 w-full px-2 py-1 "
                                    id="id-no"
                                    name="id-no"
                                    type="text"
                                    autoComplete="off"
                                    required
                                    value={specification}
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
                                <label className="block mb-2" htmlFor="name">
                                    Password:
                                </label>
                                <input
                                    className="bg-gray-100 border-2 w-full px-2 py-1 "
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="off"
                                    required
                                    value={password}
                                    onChange={onPasswordChanged}
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block mb-2" htmlFor="name">
                                    Confirm password:
                                </label>
                                <input
                                    className="bg-gray-100 border-2 w-full px-2 py-1 "
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="off"
                                    required
                                    value={confirmPassword}
                                    onChange={onConfirmPasswordChanged}
                                />
                            </div>
                        </div>
                        <div className="text-center">
                            <button type="submit" className="bg-primaryColor text-white font-bold py-2 px-4 rounded">
                                Add User
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AdminNewUserForm;
