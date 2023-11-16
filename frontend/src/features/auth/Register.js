import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { server } from '../../server';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const navigate = useNavigate()

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
    const register = async (event) => {
        console.log(canSave)
        event.preventDefault();
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            toast.error("Passwords do not match");
            return; // Stop the form submission
        } else {
            setPasswordError(''); // Reset the password error if they match
            try {
                // const config = {
                //     headers: {
                //         "Content-type": "application/json",
                //         token: `Bearer ${accessToken}`,
                //     },
                // }
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
                // config
                );
                console.log('User registered:', data);
                toast.success("Account created successfully!");
                navigate(`/login`)
            } catch (error) {
                console.log('User registration failed:', error);
                toast.error(error.response.data.message);
            }
        }
    }

    return (
        <>
            <div className="absolute hidden lg:flex flex-col left-0 bottom-0">
                <img alt="" src="https://file.rendit.io/n/d4pFfFHPbtM6Gj5j2YWE.svg" className="w-20 h-16 absolute top-64 left-0" />
                <img alt="" src="https://file.rendit.io/n/KPfOZKCRuRSFGmey9AWj.svg" className="w-12 h-56 absolute top-24 left-0" />
                <img alt="" src="https://file.rendit.io/n/lnOSNwFIl9xHUHBhIDjt.svg" className="relative"/>
            </div>
            <section
                className="public min-h-screen flex items-center justify-center w-full"
            >
                <div className='bg-gray-100 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl shadow-md min-h-max w-screen lg:w-3/5 border-green-700 px-10 pt-4'>
                    {/* <div className='pb-4 flex justify-between'>
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
                    </div> */}
                    <div className="items-start">
                        <div className="border-solid font-semibold flex flex-col justify-center w-full mb-4">
                            <div className="p-4 flex flex-col">
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
                                <form onSubmit={register} className='flex flex-col gap-2'>
                                    <div className="lg:flex flex-row hidden w-full">
                                        <div className="w-1/2 mr-4">
                                            <label className="block mb-2"><span className='text-red-500'>*</span>
                                                Name:
                                            </label>
                                            <input
                                                className="border border-gray-300 p-2 rounded-md w-full "
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
                                            <label className="block mb-2"><span className='text-red-500'>*</span>
                                                ID Number:
                                            </label>
                                            <input
                                                className="border border-gray-300 p-2 rounded-md w-full "
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
                                    <div className="lg:hidden w-full mr-4">
                                        <label className="block mb-2"><span className='text-red-500'>*</span>
                                            Name:
                                        </label>
                                        <input
                                            className="border border-gray-300 p-2 rounded-md w-full "
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoComplete="off"
                                            required
                                            value={name}
                                            onChange={onNameChanged}
                                        />
                                    </div>
                                    <div className="lg:hidden w-full">
                                        <label className="block mb-2"><span className='text-red-500'>*</span>
                                            ID Number:
                                        </label>
                                        <input
                                            className="border border-gray-300 p-2 rounded-md w-full "
                                            id="id-no"
                                            name="id-no"
                                            type="text"
                                            autoComplete="off"
                                            value={idNum}
                                            required
                                            onChange={onIdNumChanged}
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label className="block mb-2"><span className='text-red-500'>*</span>
                                            Email:
                                        </label>
                                        <input
                                            className="border border-gray-300 p-2 rounded-md w-full "
                                            id="name"
                                            name="name"
                                            type="email"
                                            autoComplete="off"
                                            value={email}
                                            required
                                            onChange={onEmailChanged}
                                        />
                                    </div>
                                    <div className="lg:flex flex-row hidden w-full">
                                        <div className="w-1/2 mr-4">
                                            <label className="block mb-2"><span className='text-red-500'>*</span>
                                                Phone number:
                                            </label>
                                            <input
                                                className="border border-gray-300 p-2 rounded-md w-full "
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
                                            <label className="block mb-2"><span className='text-red-500'>*</span>{specificationLabel}</label>
                                            <input
                                                className="border border-gray-300 p-2 rounded-md w-full "
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
                                    <div className="lg:hidden w-full mr-4">
                                        <label className="block mb-2"><span className='text-red-500'>*</span>
                                            Phone number:
                                        </label>
                                        <input
                                            className="border border-gray-300 p-2 rounded-md w-full "
                                            id="name"
                                            name="name"
                                            type="number"
                                            autoComplete="off"
                                            value={phoneNumber}
                                            required
                                            onChange={onPhoneNumberChanged}
                                        />
                                    </div>
                                    <div className="lg:hidden w-full">
                                        <label className="block mb-2"><span className='text-red-500'>*</span>{specificationLabel}</label>
                                        <input
                                            className="border border-gray-300 p-2 rounded-md w-full "
                                            id="id-no"
                                            name="id-no"
                                            type="text"
                                            autoComplete="off"
                                            value={specification}
                                            required
                                            onChange={onSpecificationChanged}
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label className="block mb-2">
                                            Twitter link:
                                        </label>
                                        <input
                                            className="border border-gray-300 p-2 rounded-md w-full "
                                            id="twt-link"
                                            name="twt-link"
                                            type="text"
                                            autoComplete="off"
                                            value={twitterLink}
                                            onChange={onTwitterLinkChanged}
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label className="block mb-2">
                                            Facebook link:
                                        </label>
                                        <input
                                            className="border border-gray-300 p-2 rounded-md w-full "
                                            id="fb-link"
                                            name="fb-link"
                                            type="text"
                                            autoComplete="off"
                                            value={facebookLink}
                                            onChange={onFacebookLinkChanged}
                                        />
                                    </div>
                                    <div className="lg:flex flex-row hidden w-full">
                                        <div className="w-1/2 mr-4">
                                            <label className="block mb-2"><span className='text-red-500'>*</span>
                                                Password:
                                            </label>
                                            <input
                                                className="border border-gray-300 p-2 rounded-md w-full "
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
                                                className="border border-gray-300 p-2 rounded-md w-full "
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
                                    <div className="lg:hidden w-full mr-4">
                                        <label className="block mb-2"><span className='text-red-500'>*</span>
                                            Password:
                                        </label>
                                        <input
                                            className="border border-gray-300 p-2 rounded-md w-full "
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="off"
                                            value={password}
                                            required
                                            onChange={onPasswordChanged}
                                        />
                                    </div>
                                    <div className="lg:hidden w-full">
                                        <label className="block mb-2"><span className='text-red-500'>*</span>
                                            Confirm password:
                                        </label>
                                        <input
                                            className="border border-gray-300 p-2 rounded-md w-full "
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="off"
                                            value={confirmPassword}
                                            required
                                            onChange={onConfirmPasswordChanged}
                                        />
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="border-solid border-primaryColor bg-primaryColor font-semibold py-2 px-4 rounded-md w-full mt-4 text-white">
                                            Register
                                        </button>
                                    </div>
                                </form>

                            </div>
                            
                        </div>
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
        </>
    );
}

export default Register