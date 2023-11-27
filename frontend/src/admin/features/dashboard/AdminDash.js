import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import useAdminAuth from '../../hooks/useAdminAuth';
import PulseLoader from 'react-spinners/PulseLoader';
import AdminBarChart from '../../components/AdminBarChart';
import AdminYearSelector from './AdminYearSelector';
import { processData } from '../../../config/processData';
import AdminPieChart from '../../components/AdminPieChart';
import { server } from '../../../server';

const AdminDash = () => {
    const navigate = useNavigate()
    const { accessToken } = useAdminAuth;

    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [counts, setCounts] = useState('');
    const [error, setError] = useState(null)
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true)
    const [barLoading, setBarLoading] = useState(true)

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    // Create a function to handle the "Go" button click
    const handleGoButtonClick = () => {
        if (selectedStartDate && selectedEndDate) {
            getReportsWithDateRange(selectedStartDate, selectedEndDate);
        } else {
            // Fetch all-time total results
            getReportsWithDateRange('', '');
        }
    };

    const handleYearChange = (year) => {
        setSelectedYear(year);

        // Fetch data for the selected year
        // You need to modify this part to fetch data for the selected year
        // You might need to add an API endpoint that accepts the year as a parameter
        // and returns the data for that year.
    };

    // Function to fetch data based on the selected year
    const fetchDataByYear = async (year) => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    token: `Bearer ${accessToken}`,
                },
            };
            // Make an API request to get data for the selected year
            const {data} = await axios.get(`${server}/dashboard/counts/${year}`, config);
            console.log('fetchDataByYear',data)
            setChartData(data);
        } catch (error) {
            console.error(error);
        } finally {
            setBarLoading(false);
        }
    };

    // Create a function to fetch all reports
    const getReportsWithDateRange  = async (startDate, endDate) => {
        
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    token: `Bearer ${accessToken}`,
                },
            };

            let url = `${server}/dashboard/counts?startDate=${startDate}&endDate=${endDate}`;

            
            const { data } = await axios.get(url, config); // Replace with your API endpoint
            
        
            await setCounts(data); // Set the reports in state
            console.log(counts)
            console.log(data)
        } catch (error) {
            console.error(error);
            setError(error)
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        // Fetch all-time total results when the page is initially loaded
        getReportsWithDateRange('', '');

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        fetchDataByYear(selectedYear);
        // eslint-disable-next-line
    }, [selectedYear]);

    let content

    if (error) {
        content = (
            <div className="p-20 w-full flex justify-center">
                <p className="flex justify-center">{error}</p>
            </div>
            
        )
    } 

    if (loading === true || barLoading === true) {
        content = (
            <div className="p-20 w-full flex justify-center">
                <PulseLoader color={"#000"} />
            </div>
        )
    } else {
        content = (
            <>
                <div className='p-8 lg:p-20 w-full flex flex-col gap-4 rounded-lg border'>
                    
                    {/* <p>{today}</p> */}
                    <div className=' flex flex-col sm:flex-row justify-between gap-4 sm:gap-0'>
                        <h1 className='text-3xl font-bold text-primaryColor'>Dashboard</h1>
    
                        <div className="flex flex-col sm:flex-row sm:w-max w-full gap-2">
                            <input
                                type="date"
                                name="start-date"
                                id="start-date"
                                value={selectedStartDate}
                                onChange={(e) => setSelectedStartDate(e.target.value)}
                                max={selectedEndDate}
                                className="bg-gray-100 border-2 w-full px-2 py-1 rounded-lg"
                            />
    
                            <input
                                type="date"
                                name="end-date"
                                id="end-date"
                                value={selectedEndDate}
                                onChange={(e) => setSelectedEndDate(e.target.value)}
                                max={selectedEndDate}
                                className="bg-gray-100 border-2 w-full px-2 py-1 rounded-lg"
                            />
    
                            <button
                                onClick={handleGoButtonClick}
                                className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                            >
                                Go
                            </button>
                        </div>
                    </div>
                    <div className='sm:py-4 flex flex-col sm:flex-row gap-4 w-full'>
                        
                            <div 
                                className='flex flex-col justify-between p-4 w-full border cursor-pointer hover:bg-yellow-100 hover:border-yellow-100' 
                                onClick={() =>
                                    navigate(`/admin/dash/reports/missing`)
                                }
                            >
                                <h1 className='font-bold'>Missing Reports</h1>
                                <div className='flex justify-between items-center'>
                                    <h1 className='font-bold text-2xl'>{counts.missingReportCount}</h1>
                                    {/* <h1>+25</h1> */}
                                </div>
                            </div>
                            <div 
                                className='flex flex-col justify-between p-4 w-full border cursor-pointer hover:bg-yellow-100 hover:border-yellow-100'
                                onClick={() =>
                                    navigate(`/admin/dash/reports/found`)
                                }
                            >
                                <h1 className='font-bold'>Claimable Found Reports</h1>
                                <div className='flex justify-between items-center'>
                                    <h1 className='font-bold text-2xl'>{counts.claimableReportCount}</h1>
                                    {/* <h1>+25</h1> */}
                                </div>
                            </div>
                            <div 
                                className='flex flex-col justify-between p-4 w-full border cursor-pointer hover:bg-yellow-100 hover:border-yellow-100'
                                onClick={() =>
                                    navigate(`/admin/dash/reports/found`)
                                }
                            >
                                <h1 className='font-bold'>Processing Found Reports</h1>
                                <div className='flex justify-between items-center'>
                                    <h1 className='font-bold text-2xl'>{counts.processingReportCount}</h1>
                                    {/* <h1>+25</h1> */}
                                </div>
                            </div>
                            <div 
                                className='flex flex-col justify-between p-4 w-full border cursor-pointer hover:bg-yellow-100 hover:border-yellow-100'
                                onClick={() =>
                                    navigate(`/admin/dash/referenceNumber`)
                                }
                            >
                                <h1 className='font-bold'>Claimed Reports</h1>
                                <div className='flex justify-between items-center'>
                                    <h1 className='font-bold text-2xl'>{counts.claimedReportCount}</h1>
                                    {/* <h1>+25</h1> */}
                                </div>
                            </div>
                    </div>
                    <div className='sm:py-4 flex flex-col sm:flex-row justify-between gap-4'>
                        <div className='w-full sm:w-1/2 border flex flex-col justify-between p-4'>
                            <h1 className='font-bold'>Top Missing Locations</h1>
                            <ul>
                                {/* {counts.locationCounts.map(([location, count]) => (
                                    <li key={location}>
                                        {location}: {count}
                                    </li>
                                ))} */}
                                {counts.locationCounts.slice(0, 5).map(([location, count]) => (
                                    <li key={location}>
                                        {location}: {count}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='w-full sm:w-1/2 border flex flex-col p-4'>
                            <h1 className='font-bold'>Top User Specifications</h1>
                            <ul>
                                {/* {counts.userSpecifications.map(([specification, count]) => (
                                    <li key={specification}>
                                        {specification}: {count}
                                    </li>
                                ))} */}
                                {counts.userSpecifications.slice(0, 5).map(([location, count]) => (
                                    <li key={location}>
                                        {location}: {count}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className='sm:py-4 flex justify-between gap-y-4 '>
                        {/* <div className='w-2/5 border flex flex-col justify-between p-4'>
                            <h1 className='font-bold'>Items</h1>
                            
                            <AdminPieChart />
                        </div> */}
                        <div className='w-full border flex flex-col justify-between p-4 overflow-hidden'>
                            <h1 className='font-bold'>Monthly Reported Items</h1>
                            <div className="">
                                <AdminYearSelector selectedYear={selectedYear} onYearChange={handleYearChange} />
                            </div>
                            {barLoading ? (
                                <div className="w-full h-screen flex items-center justify-center">
                                    <div className="flex justify-center">
                                        <PulseLoader  color={"#000"} />
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-scroll">
                                    <AdminBarChart data={chartData} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        )
    }


    return content
}
export default AdminDash