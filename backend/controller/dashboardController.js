const Report = require('../models/Report');
const ClaimedReport = require('../models/ClaimedReport');
const User = require('../models/User');

const getReportCounts = async (req, res, next) => {
    try {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        const missingReports = await Report.find({
            reportType: 'MissingReport',
            ...(startDate && endDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {}),
        });

        const locationCounts = {};
        const userSpecifications = {};

        // Calculate location counts
        missingReports.forEach((report) => {
            // console.log(report)
            const { location } = report;
            if (locationCounts[location]) {
                locationCounts[location]++;
            } else {
                locationCounts[location] = 1;
            }
        });
        // console.log(locationCounts)

        // Calculate user specifications counts
        for (const report of missingReports) {
            const creator = await User.findById(report.creatorId);
            if (creator && creator.specification) {
                if (userSpecifications[creator.specification]) {
                    userSpecifications[creator.specification]++;
                } else {
                    userSpecifications[creator.specification] = 1;
                }
            }
        }

        // Sort location counts from highest to lowest
        const sortedLocationCounts = Object.entries(locationCounts).sort(
            (a, b) => b[1] - a[1]
        );

        // Sort user specifications counts from highest to lowest
        const sortedUserSpecifications = Object.entries(userSpecifications).sort(
            (a, b) => b[1] - a[1]
        );

        const missingReportCount = await Report.countDocuments({
            reportType: 'MissingReport',
            reportStatus: 'Missing',
            ...(startDate && endDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {}),
        });

        const claimedReportCount = await ClaimedReport.countDocuments({
            ...(startDate && endDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {}),
        });

        const claimableReportCount = await Report.countDocuments({
            reportType: 'FoundReport',
            reportStatus: 'Claimable',
            ...(startDate && endDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {}),
        });

        const processingReportCount = await Report.countDocuments({
            reportType: 'FoundReport',
            reportStatus: 'Processing',
            ...(startDate && endDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {}),
        });

        const userCount = await User.countDocuments({
            ...(startDate && endDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {}),
        });

        return res.json({
            missingReportCount,
            claimedReportCount,
            claimableReportCount,
            processingReportCount,
            userCount,
            locationCounts: sortedLocationCounts,
            userSpecifications: sortedUserSpecifications,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getBarChartData = async (req, res, next) => {
    try {
        console.log(req.params.year)
        const year = parseInt(req.params.year); // Parse the year from the URL parameter
        const startOfYear = new Date(year, 0, 1); // January 1st of the selected year
        const endOfYear = new Date(year, 11, 31, 23, 59, 59); // December 31st of the selected year

        // Fetch data for the selected year from your database
        // You can use Mongoose or any other database library here
        const data = await Report.find({
            reportType: 'MissingReport',
            date: {
                $gte: startOfYear,
                $lte: endOfYear,
            },
            /* Add more filters based on your data structure if needed */
        });

        // Process the data to calculate counts for each month
        // You should return data in a format that can be consumed by your chart component

        // Function to process data and calculate counts for each month
        const processData = (data) => {
            // Initialize an object to store counts for each month
            const countsByMonth = {};
            
            // Iterate through the data and count reports for each month
            data.forEach((report) => {
                const reportDate = new Date(report.date);
                const year = reportDate.getFullYear();
                const month = reportDate.getMonth(); // Month is 0-based (0 = January, 11 = December)
                
                // Create a key for the month and year combination
                const key = `${year}-${month}`;
                
                // Increment the count for the month
                if (countsByMonth[key]) {
                    countsByMonth[key]++;
                } else {
                    countsByMonth[key] = 1;
                }
            });
            
            // Transform countsByMonth object into an array of objects
            const formattedData = Object.entries(countsByMonth).map(([key, value]) => ({
                month: key,
                count: value,
            }));
            
            return formattedData;
        };

        const formattedData = processData(data);
        
        res.json(formattedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getReportCounts, getBarChartData };