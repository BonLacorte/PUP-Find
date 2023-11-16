import React, { useState } from 'react'
import map from '../../img/map.png'
import Lightbox from '@seafile/react-image-lightbox';
import '@seafile/react-image-lightbox/style.css';

const FoundLocatePage = () => {

    // State for handling lightbox
    const [isOpen, setIsOpen] = useState(false);

    // Function to open the lightbox
    const openLightbox = () => {
        setIsOpen(true);
    };

    return (
        <div className="bg-white flex flex-col justify-center items-center w-full h-[90vh] border-green-700">
            <div className="absolute hidden xl:flex flex-col left-0 bottom-0">
                <img alt="" src="https://file.rendit.io/n/d4pFfFHPbtM6Gj5j2YWE.svg" className="w-20 h-16 absolute top-64 left-0" />
                <img alt="" src="https://file.rendit.io/n/KPfOZKCRuRSFGmey9AWj.svg" className="w-12 h-56 absolute top-24 left-0" />
                <img alt="" src="https://file.rendit.io/n/lnOSNwFIl9xHUHBhIDjt.svg" className="relative"/>
            </div>
            <div className='flex flex-col justify-center w-full px-10 gap-16 border-red-700'>
                <div className="flex flex-row justify-center items-center w-full border-blue-700">
                    <div className="flex flex-col gap-2  items-center border-yellow-700">
                        <div className="flex flex-col gap-3 w-full items-start ">
                            <span className="text-2xl md:text-4xl font-semibold w-full">
                                Thank you for reporting found item
                            </span>
                            <span className="text-lg md:text-2xl mb-1 w-3/5">
                                To surrender found item please proceed to the Public Desk Office
                            </span>
                            <span className="text-lg md:text-2xl mb-1">
                                Located at: PUP A. Mabini (main) Campus, ground floor
                            </span>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col justify-center items-center h-[50vh] border-blue-700'>
                    <img src={map} className='h-full' alt="" onClick={openLightbox}/>
                    {isOpen && (
                        <Lightbox
                            mainSrc={map}
                            onCloseRequest={() => setIsOpen(false)}
                            enableZoom={true}
                            imagePadding={50}
                        />
                    )}
                </div>
            </div>
            <img alt="" src="https://file.rendit.io/n/6pqpGxjbbyM1B8AnjoDp.svg" className="hidden lg:flex w-[111px] h-40 absolute top-24 right-40"/>
            <div className="absolute hidden xl:flex flex-col w-56 items-start right-0 bottom-0">
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
    )
}

export default FoundLocatePage