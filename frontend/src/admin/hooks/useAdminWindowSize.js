import { useEffect, useState } from 'react'

const useAdminWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        // Function to update window size
        function handleResize() {
            setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
            });
        }
    
        // Attach event listener
        window.addEventListener('resize', handleResize);
    
        // Clean up the event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return windowSize;
}

export default useAdminWindowSize