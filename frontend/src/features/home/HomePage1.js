import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import items from '../../img/items1.png'
import front from '../../img/front.png'

const HomePage1 = () => {
    const navigate = useNavigate()

    return (
        <div className="bg-white flex flex-row items-end justify-center w-screen h-screen lg:h-[90vh] border-green-700">
            {/* Left Div (Logo and Images) */}
            <div className="flex-col lg:w-[50%] h-full items-center justify-center hidden lg:flex py-20 border-orange-700">
                {/* <img alt="" src="https://file.rendit.io/n/6pqpGxjbbyM1B8AnjoDp.svg" className="w-[111px] h-40 absolute top-24 left-0"/> */}
                <div className='border-blue-700'>
                    <img alt="" src={front} />
                </div>
                
            </div>
            {/* Right Div (Text and Buttons) */}
            <div className="flex flex-col lg:w-[50%] h-full items-start justify-center px-4 lg:px-8 pb-56  border-violet-700">
                    <img alt="" src="https://file.rendit.io/n/6pqpGxjbbyM1B8AnjoDp.svg" className="hidden lg:flex w-[111px] h-40 absolute top-24 right-0"/>
                    <div className='lg:px-2 w-full border-blue-700'>
                        <div className="flex flex-col justify-end items-center pb-8  lg:pb-16">
                            <img alt="" src="https://file.rendit.io/n/033oE67RrtllAVLok4Ha.png"/>
                            <span className="text-4xl lg:text-8xl font-bold text-primaryColor">
                                PUPFind
                            </span>
                            <span className="text-center text-lg lg:text-2xl font-semibold text-primaryColor">
                                Find what's lost, surrender what's found
                            </span>
                        </div>
                        <div className="flex flex-col w-full lg:flex-row gap-5 items-center justify-center border-orange-700">
                            
                                <button className="bg-primaryColor flex flex-col justify-center items-center rounded-md w-full py-2 px-2 text-center text-lg font-semibold text-white" onClick={() => {navigate(`/dash/missing`)}}>
                                    CREATE MISSING REPORT
                                </button>
                            
                                <button className="bg-secondaryColor flex flex-col justify-center items-center rounded-md w-full py-2 px-2 text-center text-lg font-semibold" onClick={() => {navigate(`/dash/found/new`)}}>
                                    CREATE FOUND REPORT
                                </button>
                            
                        </div>
                    </div>
                    <div className="absolute hidden xl:flex flex-col w-56 items-start right-0 bottom-[-190px]">
                        <img alt=""
                            src="https://file.rendit.io/n/AyZ958KVZDdkvBnClSIZ.svg"
                            className="w-40 h-40 absolute top-16 left-16"
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
        </div>
    )
}

export default HomePage1