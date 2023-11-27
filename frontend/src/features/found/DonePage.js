import React from 'react'
import { Link, useLocation  } from 'react-router-dom'

const DonePage = () => {
    const location = useLocation();
    const proof  = location.state // Provide a default value if location.state is null

    // const content = <h1>{proof && proof.userId}</h1>
    const content = proof && proof.userId 
        ? 
            <div className="bg-white flex flex-col justify-center items-center w-full h-[90vh] border-blue-700 ">
                <div className="absolute hidden lg:flex flex-col left-0 bottom-0">
                    <img alt="" src="https://file.rendit.io/n/d4pFfFHPbtM6Gj5j2YWE.svg" className="w-20 h-16 absolute top-64 left-0" />
                    <img alt="" src="https://file.rendit.io/n/KPfOZKCRuRSFGmey9AWj.svg" className="w-12 h-56 absolute top-24 left-0" />
                    <img alt="" src="https://file.rendit.io/n/lnOSNwFIl9xHUHBhIDjt.svg" className="relative"/>
                </div>
                <div className="flex flex-row justify-between lg:w-3/5 items-center w-full px-10 border-red-700">
                    
                    <div className="flex flex-col gap-10 items-center">
                        <div className="gap-10 flex flex-col w-full border-orange-600">
                            <div className="flex flex-col gap-3 w-full items-start ">
                                <span className="text-2xl md:text-4xl font-semibold w-full">
                                    Thank you for reporting found item
                                </span>
                                <span className="text-lg md:text-2xl mb-1 w-3/5">
                                    To surrender found item please proceed to the Public Desk Office{" "}
                                </span>
                                <span className="text-lg md:text-2xl mb-1 hidden lg:flex" id="LocatedIn">
                                    Located in:{" "}
                                </span>
                                <button className="bg-secondaryColor hidden lg:flex flex-col justify-center items-center rounded-md h-12 py-2 px-4">
                                    <Link to={`/dash/found/locate`} className="text-center text-sm md:text-lg font-semibold">
                                        OPEN PUP MAP
                                    </Link>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between gap-4 items-start border-blue-700">
                            {/* <div className="text-4xl font-semibold w-5/6">
                                Report missing item
                            </div> */}
                            <span className="text-md md:text-xl w-3/5 md:w-full">
                                Note: This Found report will not be verified until it is successfully surrendered to the Public Desk Office{" "}
                            </span>
                            <button className="bg-primaryColor flex flex-col justify-center items-center rounded-md h-12 py-2 px-4">
                                <Link to={`/dash/`} className="text-center text-sm md:text-lg font-semibold text-white">
                                    DONE
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
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
        :
        <div>
            <p>Data not available. Please navigate through the appropriate route.</p>
        </div>

    return content
    
}

export default DonePage