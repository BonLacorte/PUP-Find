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

    // Sort the formattedData array by month and year
    formattedData.sort((a, b) => {
        const [yearA, monthA] = a.month.split('-').map(Number);
        const [yearB, monthB] = b.month.split('-').map(Number);

        if (yearA !== yearB) {
            return yearA - yearB;
        }

        return monthA - monthB;
    });

    return formattedData;
};
