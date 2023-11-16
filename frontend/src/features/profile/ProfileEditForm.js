import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { server } from "../../server";

// const PHONE_NUMBER_REGEX = /^[0-9]{10}$/;
// You can define more regex patterns for other fields if needed

const membershipOptions = ["Student", "Professor", "Staff"];

const specificationOptions = {
    Student: ["BSIT", "BSCS", "BSCE", "BSME"],
    Professor: ["CCIS", "COE"],
    Staff: ["Guard", "Utility", "Canteen"],
};

const ProfileEditForm = ({ user }) => {
    // const { userId, name, accessToken } = useAuth()

    const navigate = useNavigate()
    const { id } = useParams();

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

    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState()
    const [isSuccess, setIsSuccess] = useState(false)
    const [profile, setProfile] = useState()

    
    const canEdit = [name, email, image, selectedMembership, phoneNumber, specification, twitterLink, facebookLink, password] 

    // Function to update user data
    const updateUser = async (event) => {
        event.preventDefault()
        console.log(canEdit)
        // Check if the 'Password' and 'Confirm Password' fields match
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            toast.error("Passwords do not match");
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
                navigate(`/dash/profile/`)
                console.log('User updated:', data);
            } catch (error) {
                console.log('User update failed:', error);
                toast.error(error.response.data.message);
            }
        }
    };

    const onNameChanged = (e) => setName(e.target.value);
    const onIdNumChanged = (e) => setIdNum(e.target.value);
    const onEmailChanged = (e) => setEmail(e.target.value);
    const onPhoneNumberChanged = (e) => setPhoneNumber(e.target.value);
    const onSpecificationChanged = (e) => setSpecification(e.target.value);
    const onTwitterLinkChanged = (e) => setTwitterLink(e.target.value);
    const onFacebookLinkChanged = (e) => setFacebookLink(e.target.value);
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

    return (
            <>
                <div className="bg-white flex flex-col justify-center items-center w-screen h-full border-blue-700">
                    <div className="absolute hidden lg:flex flex-col left-0 bottom-0">
                        <img alt="" src="https://file.rendit.io/n/d4pFfFHPbtM6Gj5j2YWE.svg" className="w-20 h-16 absolute top-64 left-0" />
                        <img alt="" src="https://file.rendit.io/n/KPfOZKCRuRSFGmey9AWj.svg" className="w-12 h-56 absolute top-24 left-0" />
                        <img alt="" src="https://file.rendit.io/n/lnOSNwFIl9xHUHBhIDjt.svg" className="relative"/>
                    </div>
                    <section
                        className="public min-h-screen flex items-center justify-center border-orange-700 w-full"
                    >
                        {/* <div className="flex flex-col justify-center items-center w-3/5 border border-blue-700"> */}
                        <div className="bg-gray-100 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl shadow-md min-h-screen w-screen lg:w-3/5 border-green-700 px-10 ">
                            {/* <h1 className="text-3xl font-bold my-4">
                                Edit Profile
                            </h1> */}
                            <div className="font-semibold md:mx-auto lg:w-3/4 xl:w-1/2 w-full">
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
                                        disabled
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
                                            <label className="block mb-2"><span className='text-red-500'>*</span>
                                                Name:
                                            </label>
                                            <input
                                                className="border border-gray-300 p-2 rounded-md w-full"
                                                id="name"
                                                name="name"
                                                type="text"
                                                autoComplete="off"
                                                value={name}
                                                disabled
                                                onChange={onNameChanged}
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block mb-2"><span className='text-red-500'>*</span>
                                                ID Number:
                                            </label>
                                            <input
                                                className="border border-gray-300 p-2 rounded-md w-full"
                                                id="id-no"
                                                name="id-no"
                                                type="text"
                                                autoComplete="off"
                                                value={idNum}
                                                required
                                                disabled
                                                onChange={onIdNumChanged}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full mb-4">
                                        <label className="block mb-2"><span className='text-red-500'>*</span>
                                            Email:
                                        </label>
                                        <input
                                            className="border border-gray-300 p-2 rounded-md w-full"
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
                                            <label className="block mb-2"><span className='text-red-500'>*</span>
                                                Phone number:
                                            </label>
                                            <input
                                                className="border border-gray-300 p-2 rounded-md w-full"
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
                                            <label className="block mb-2"><span className='text-red-500'>*</span>
                                                {selectedMembership === 'Student' ? 'Section: (Ex: BSIT 3-2)' : selectedMembership === 'Professor' ? 'Department: (Ex: CCIS)' : 'Role: (Ex: Utility)'}
                                            </label>
                                            <input
                                                className="border border-gray-300 p-2 rounded-md w-full"
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
                                        <label className="block mb-2">
                                            Twitter link:
                                        </label>
                                        <input
                                            className="border border-gray-300 p-2 rounded-md w-full"
                                            id="twt-link"
                                            name="twt-link"
                                            type="text"
                                            autoComplete="off"
                                            value={twitterLink}
                                            onChange={onTwitterLinkChanged}
                                        />
                                    </div>
                                    <div className="flex flex-col w-full mb-4">
                                        <label className="block mb-2">
                                            Facebook link:
                                        </label>
                                        <input
                                            className="border border-gray-300 p-2 rounded-md w-full"
                                            id="fb-link"
                                            name="fb-link"
                                            type="text"
                                            autoComplete="off"
                                            value={facebookLink}
                                            onChange={onFacebookLinkChanged}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">
                                            For verification:
                                        </label>
                                    </div>
                                    <div className="flex flex-row w-full mb-8">
                                        <div className="w-1/2 mr-4">
                                            <label className="block mb-2"><span className='text-red-500'>*</span>
                                                Password:
                                            </label>
                                            <input
                                                className="border border-gray-300 p-2 rounded-md w-full"
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
                                            <label className="block mb-2"><span className='text-red-500'>*</span>
                                                Confirm password:
                                            </label>
                                            <input
                                                className="border border-gray-300 p-2 rounded-md w-full"
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
                                        <button  className="border-solid border-primaryColor bg-primaryColor font-semibold py-2 px-4 rounded-md w-full mt-4 text-white">
                                            Update User
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                    
                    <img alt="" src="https://file.rendit.io/n/6pqpGxjbbyM1B8AnjoDp.svg" className="hidden lg:flex w-[111px] h-40 absolute top-24 right-40"/>
                    <div className="absolute hidden lg:flex flex-col w-56 items-start right-0 bottom-0">
                        <img alt=""
                            src="https://file.rendit.io/n/AyZ958KVZDdkvBnClSIZ.svg"
                            className="w-40 h-40 absolute top-16 left-16 overflow-hidden"
                            id="Ellipse"
                        />
                        <img alt=""
                            src="https://file.rendit.io/n/52Gyzn7j1eB4irdFrXjv.svg"
                            className="w-32 h-[286px] absolute top-24 left-24"
                            id="Ellipse1"
                        />
                        <img alt=""
                            src="https://file.rendit.io/n/i41HWlHDYSfHPajsbj4O.svg"
                            className="relative"
                            id="Ellipse2"
                        />
                    </div>
                </div>
            </>
        )
    }


export default ProfileEditForm;
