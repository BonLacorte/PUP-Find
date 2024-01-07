import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";

// const PHONE_NUMBER_REGEX = /^[0-9]{10}$/;
// You can define more regex patterns for other fields if needed

const membershipOptions = ["Student", "Professor", "Staff"];

const specificationOptions = {
    Student: ["BSIT", "BSCS", "BSCE", "BSME"],
    Professor: ["CCIS", "COE"],
    Staff: ["Guard", "Utility", "Canteen"],
};

const ProfileEditForm = () => {
    const { userId, name, accessToken } = useAuth()

    const [selectedMembership, setSelectedMembership] = useState();
    
    const [selectedSpecification, setSelectedSpecification] = useState();

    const [previewImage, setPreviewImage] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState();
    const [facebookLink, setFacebookLink] = useState()
    const [twitterLink, setTwitterLink] = useState()
    const [image, setImage] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [oldImage, setOldImage] = useState([]);

    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState()
    const [isSuccess, setIsSuccess] = useState(false)
    const [profile, setProfile] = useState()

    // const canSave = [phoneNumber, facebookLink, twitterLink, selectedMembership, selectedSpecification, image] 
    const canSave = [phoneNumber, facebookLink, twitterLink, selectedMembership, selectedSpecification, image] 

    const onUpdateProfileClicked = async (event) => {
        event.preventDefault();
        // console.log(canSave)
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    token: `Bearer ${accessToken}`,
                },
            };

            await axios.put(
                `http://localhost:3500/user/${userId}`,
                {
                    phoneNumber: phoneNumber ? phoneNumber : profile.phoneNumber,
                    facebookLink: facebookLink ? facebookLink : profile.facebookLink,
                    twitterLink: twitterLink ? twitterLink : profile.twitterLink,
                    specification: selectedSpecification,
                    membership: selectedMembership,
                    pic: image,
                },
                config
            );

            // toast.success("Profile updated successfully!");
        } catch (error) {
            // console.log(error);
            // toast.error("Error updating the profile");
        }
    };

    const fetchInfo = async () => {
        try {
            const config = {
                headers: {
                    token: `Bearer ${accessToken}`,
                },
            };

            const { data } = await axios.get(`http://localhost:3500/user/${userId}`, config);
            // console.log(data)
            
            setProfile(data)

            setIsLoading(false);
            setIsSuccess(true);
        } catch (error) {
            // console.log(error)
            setError(error)
            setIsLoading(false);
            setIsError(true);
        }
    }

    useEffect(() => {
        fetchInfo()

        profile ? setIsSuccess(true) : setIsLoading(true)
    }, []);

    useEffect(() => {
        // Set initial selectedMembership and selectedSpecification values based on profile data
        if (profile && profile.membership) {
            setSelectedMembership(profile.membership);
            setSelectedSpecification(profile.specification);
        }

        if (profile) {
            setOldImage(profile.pic)
            setPhoneNumber(profile.phoneNumber)
            setFacebookLink(profile.facebookLink)
            setTwitterLink(profile.twitterLink)
        }
    }, [profile]);

    const handleImageUpload = (e) => {

        const file = e.target.files[0];

        setImage([]);
        setImagesPreview([]);
        
        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                setImagesPreview(reader.result);
                setImage(reader.result)
                }
            };

            reader.readAsDataURL(file);
        }
    };

    let content

    if (isLoading) {
        content = (
            <div className="bg-customBackground min-h-screen">
                <div className="flex justify-center">
                    <PulseLoader  color={"#FFF"} />
                </div>
            </div>
        )
    }
    

    if (isSuccess) {
        content = (
            <>
                <div className="bg-customBackground min-h-screen">
                    <div className="mx-auto w-3/5 flex justify-center flex-col pb-10">
                        <div>
                            <h1 className="my-4 text-2xl">
                                Edit Your Profile
                            </h1>
                        </div>
                        <form className="bg-white p-4 flex flex-col" onSubmit={onUpdateProfileClicked}>
                        {/* <form className="bg-white p-4 flex flex-col"> */}
                            {/* Other input fields here */}
                            <div className="mb-4">
                                <label className="block mb-2" htmlFor="phoneNumber">
                                    Phone Number:
                                </label>
                                <input
                                    className={`w-full py-2 px-4 border text-black border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent ? 'border-red-500' : ''}`}
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="text"
                                    autoComplete="off"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                                {/* Display error message if the phone number is invalid */}
                                
                            </div>
                            
                            <div className="mb-4">
                                <label className="block mb-2" htmlFor="phoneNumber">
                                    Facebook Link:
                                </label>
                                <input
                                    className={`w-full py-2 px-4 border text-black border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent ? 'border-red-500' : ''}`}
                                    id="facebookLink"
                                    name="facebookLink"
                                    type="text"
                                    autoComplete="off"
                                    value={facebookLink}
                                    onChange={(e) => setFacebookLink(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2" htmlFor="phoneNumber">
                                    Twitter Link:
                                </label>
                                <input
                                    className={`w-full py-2 px-4 border text-black border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent ? 'border-red-500' : ''}`}
                                    id="twitterLink"
                                    name="twitterLink"
                                    type="text"
                                    autoComplete="off"
                                    value={twitterLink}
                                    onChange={(e) => setTwitterLink(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2" htmlFor="membership">
                                    Membership:
                                </label>
                                <select
                                    className={`w-full py-2 px-4 border text-black border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent ? 'border-red-500' : ''}`}
                                    id="membership"
                                    name="membership"
                                    value={selectedMembership}
                                    onChange={(e) => setSelectedMembership(e.target.value)}
                                >
                                    <option value="">Select Membership</option>
                                    {membershipOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                    ))}
                                </select>
                                </div>

                                <div className="mb-4">
                                <label className="block mb-2" htmlFor="specification">
                                    Specification:
                                </label>
                                <select
                                    className="w-full py-2 px-4 border text-black border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                    id="specification"
                                    name="specification"
                                    value={selectedSpecification}
                                    onChange={(e) => setSelectedSpecification(e.target.value)}
                                >
                                    <option value="">Select Specification</option>
                                    {specificationOptions[selectedMembership]?.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                    ))}
                                </select>
                            </div>


                            {/* Other input fields here */}
                            
                            <div className="mb-4">
                                <label className="block mb-2" htmlFor="pic">
                                    Profile Picture:
                                </label>
                                <input
                                    className="w-full py-2 px-4 border text-black border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                    id="pic"
                                    name="pic"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />

                                <label className="block mb-2" htmlFor="image">
                                Old images:
                                </label>
                                <div className="grid grid-cols-3 gap-4 py-2">
                                    {oldImage &&
                                        <img className="w-full h-auto object-contain" src={oldImage.url} alt="Old Profile Preview" />
                                    }
                                </div>

                                <label className="block mb-2" htmlFor="image">
                                New images:
                                </label>
                                <div className="grid grid-cols-3 gap-4 py-2">
                                    {imagesPreview &&
                                        <img className="w-full h-auto object-contain" src={imagesPreview} alt="New Profile Preview" />
                                    }
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    title="Save"
                                    type="submit"
                                    // disabled={!PHONE_NUMBER_REGEX.test(profile.phoneNumber)}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    }

    if (isError) {
        content = (
            <div className="bg-customBackground min-h-screen">
                <div className="flex justify-center">
                    <p className="flex justify-center">{error}</p>
                </div>
            </div>
        )
    }

    return content
};

export default ProfileEditForm;
