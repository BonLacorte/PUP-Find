import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';
import pup1 from '../../img/PUP5.jpg';
import pup2 from '../../img/PUP.jpg';
import pup3 from '../../img/PUP2.jpg';
import pup4 from '../../img/PUP3.jpg';
import pup5 from '../../img/PUP4.jpg';
import puplogo from '../../img/puplogo.png';
import Redpupfind from '../../img/Redpupfind 4.png'
import { toast } from 'react-toastify';

const Login = () => {
    const emailRef = useRef();
    const errRef = useRef();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [persist, setPersist] = usePersist();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();

    // Background Photos
    const backgroundPhotos = [pup1, pup2, pup3, pup4, pup5];
    const [currentBackgroundPhotoIndex, setCurrentBackgroundPhotoIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [email, password]);

    useEffect(() => {
        const intervalId = setInterval(() => {
        setCurrentBackgroundPhotoIndex((prevIndex) => (prevIndex + 1) % backgroundPhotos.length);
        }, 8000);

        return () => {
        clearInterval(intervalId);
        };
    }, [backgroundPhotos.length]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isSubmitting) {
                // If the button is already submitting, ignore the click
                return;
            }
            setIsSubmitting(true);
            const data = await login({ email, password }).unwrap()
            const accessToken = data.accessToken
            localStorage.setItem("userInfo", JSON.stringify(data))
            console.log(`response`, data)
            dispatch(setCredentials({ accessToken }))
            setEmail('')
            setPassword('')
            setIsSubmitting(false);
            toast.success("User successfully logged in!");
            navigate('/dash/')
        } catch (err) {
        if (!err.status) {
            setErrMsg('No Server Response');
        } else if (err.status === 400) {
            setErrMsg('Missing Username or Password');
        } else if (err.status === 401) {
            setErrMsg('Unauthorized');
        } else {
            setErrMsg(err.data?.message);
            toast.error(err.response.data.message);
        }
        errRef.current.focus();
        }
    };

    const handleEmailInput = (e) => setEmail(e.target.value);
    const handlePwdInput = (e) => setPassword(e.target.value);
    const handleToggle = () => setPersist((prev) => !prev);

    const errClass = errMsg ? 'errmsg' : 'offscreen';

    if (isLoading) return <p>Loading...</p>;

    const content = (
        <>
            <div className="absolute hidden lg:flex flex-col left-0 bottom-0">
                <img alt="" src="https://file.rendit.io/n/d4pFfFHPbtM6Gj5j2YWE.svg" className="w-20 h-16 absolute top-64 left-0" />
                <img alt="" src="https://file.rendit.io/n/KPfOZKCRuRSFGmey9AWj.svg" className="w-12 h-56 absolute top-24 left-0" />
                <img alt="" src="https://file.rendit.io/n/lnOSNwFIl9xHUHBhIDjt.svg" className="relative"/>
            </div>
            <section
                className="public min-h-screen flex items-center justify-center bg-cover"
            >
                <div className="bg-gray-100 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl shadow-md p-10 w-96">
                {/* <div className="bg-white bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl shadow-md p-14 w-80"> */}
                    <header className="text-center">
                        {/* <img src={Redpupfind} alt="PUP Logo" className="w-20 mx-auto mb-4" /> */}
                        <img alt="" className="border w-28 mx-auto" src="https://file.rendit.io/n/033oE67RrtllAVLok4Ha.png"/>
                        <h1 className="text-3xl font-bold">PUP Find</h1>
                        <p className=" text-sm my-2">Sign in to start your session</p>
                    </header>
                    <main className="space-y-4">
                    <p ref={errRef} className={`text-red-500 ${errClass}`} aria-live="assertive">
                        {errMsg}
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-1">
                        <label htmlFor="email" className="text-gray-600 font-semibold">
                            Email:
                        </label>
                        <input
                            className="border border-gray-300 p-2 rounded-md w-full"
                            type="email"
                            id="email"
                            ref={emailRef}
                            value={email}
                            onChange={handleEmailInput}
                            autoComplete="off"
                            required
                        />
                        </div>
                        <div className="space-y-1 mt-2">
                        <label htmlFor="password" className="text-gray-600 font-semibold">
                            Password:
                        </label>
                        <input
                            className="border border-gray-300 p-2 rounded-md w-full"
                            type="password"
                            id="password"
                            onChange={handlePwdInput}
                            value={password}
                            required
                        />
                        </div>
                        <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            className="form__checkbox border-gray-300 rounded focus:ring-gray-400"
                            id="persist"
                            onChange={handleToggle}
                            checked={persist}
                        />
                        <label htmlFor="persist" className="text-gray-600">
                            Trust This Device
                        </label>
                        </div>
                        <button className="border-primaryColor bg-primaryColor text-white font-semibold py-2 px-4 rounded-md w-full mt-4" disabled={isSubmitting}>
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                        <div className="text-center mt-4">
                        {/* <Link to="#" className="text-red-700 font-semibold hover:underline">
                            I forgot my password
                        </Link> */}
                        </div>
                        <div className="text-center text-sm mt-4">
                        By using this service, you understand and agree to the PUPFind Online Services Terms of Use and Privacy Statement
                        </div>
                    </form>
                    </main>
                    <footer className="mt-4">
                    {/* <Link to="/" className="text-blue-500 hover:underline">
                        Back to Home
                    </Link> */}
                    </footer>
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

    return content;
};

export default Login;
