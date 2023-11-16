const Report = require('../models/Report')
const ClaimedReport = require('../models/ClaimedReport')
const asyncHandler = require('express-async-handler')
const cloudinary = require("../utils/cloudinary");

//@description     Get all claimed reports
//@route           GET /api/claimed-reports
//@access          Protected
const getAllClaimedReport = asyncHandler(async (req, res, next) => {
    const { search } = req.query;

    try {
        // Populate the ClaimedReport model
        const claimedReports = await ClaimedReport.find({})
            .populate({
                path: 'foundReportId',
                select: 'creatorId date itemDescription itemImage itemName location reportStatus reportType',
                populate: {
                    path: 'creatorId',
                    select: 'pic name email membership specification facebookLink phoneNumber twitterLink uid',
                },
            })
            .populate({
                path: 'missingReportId',
                select: 'creatorId date itemDescription itemImage itemName location reportStatus reportType',
                populate: {
                    path: 'creatorId',
                    select: 'pic name email membership specification facebookLink phoneNumber twitterLink uid',
                },
            });

        // Apply keyword filter to the populated fields
        const filteredReports = claimedReports.filter((claimedReport) => {
            return (
                claimedReport.foundReportId.itemName.match(new RegExp(search, 'i')) ||
                claimedReport.missingReportId.creatorId.name.match(new RegExp(search, 'i'))
            );
        });

        // console.log(filteredReports);
        // console.log(`Hello`,filteredReports.missingReportId);
        res.status(200).json(filteredReports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


//@description     Get information about a specific claimed report
//@route           GET /api/claimed-reports/:missingReportId/:foundReportId
//@access          Protected
const getClaimedReportInfo = asyncHandler(async (req, res, next) => {
    try {
        const { missingReportId, foundReportId } = req.params;

        // Find the claimed report that matches the provided IDs
        const claimedReport = await ClaimedReport.findOne({
            missingReportId,
            foundReportId
        })
        .populate({
            path: "missingReportId", 
            select: "creatorId date itemDescription itemImage itemName location reportStatus reportType",
            populate: {
                path: 'creatorId',
                select: 'pic name email membership specification facebookLink phoneNumber twitterLink uid'
            }
        })
        .populate({
            path: "foundReportId", 
            select: "creatorId date itemDescription itemImage itemName location reportStatus reportType",
            populate: {
                path: 'creatorId',
                select: 'pic name email membership specification facebookLink phoneNumber twitterLink uid'
            }
        })
        // .populate()
        if (!claimedReport) {
            return res.status(404).json({ message: 'Claimed report not found' });
        }

        console.log(claimedReport)
        res.status(200).json(claimedReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


//@description     Get information about a specific claimed report
//@route           GET /api/claimed-reports/:missingReportId/:foundReportId
//@access          Protected
const getClaimedReportById = asyncHandler(async (req, res, next) => {
    try {
        // Find the claimed report that matches the provided IDs
        const claimedReport = await ClaimedReport.findById(req.params.claimedReportId)
        .populate({
            path: "missingReportId", 
            select: "creatorId date itemDescription itemImage itemName location reportStatus reportType",
            populate: {
                path: 'creatorId',
                select: 'pic name email membership specification facebookLink phoneNumber twitterLink uid'
            }
        })
        .populate({
            path: "foundReportId", 
            select: "creatorId date itemDescription itemImage itemName location reportStatus reportType",
            populate: {
                path: 'creatorId',
                select: 'pic name email membership specification facebookLink phoneNumber twitterLink uid'
            }
        })
        // .populate()
        if (!claimedReport) {
            return res.status(404).json({ message: 'Claimed report not found' });
        }

        console.log(claimedReport)
        res.status(200).json(claimedReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


//@description     Create new Claimed report
//@route           POST /api/report
//@access          Protected
const createClaimedReport = asyncHandler(async (req, res, next) => {
    try {
        const foundReportId = req.body.foundReportId;
        const missingReportId = req.body.missingReportId;

        // Create a new ClaimedReport document
        const claimedReport = await ClaimedReport.create({
            foundReportId,
            missingReportId
        });

        // Update the reportStatus of the found report to "Claimed"
        await Report.findByIdAndUpdate(foundReportId, {
            $set: { reportStatus: "Claimed" }
        });

        // Update the reportStatus of the missing report to "Claimed"
        await Report.findByIdAndUpdate(missingReportId, {
            $set: { reportStatus: "Claimed" }
        });

        res.status(201).json(claimedReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc Delete User
// @route DELETE /users/:userId
// @access Private
const deleteClaimedReport = asyncHandler(async (req, res, next) => {
    try {
        // const { userId } = req.params.userId
        console.log(req.params.claimedReportId)
        // console.log(userId)

        // Does the user exist to delete?
        let claimedReport = await ClaimedReport.findById(req.params.claimedReportId)
            .populate({
                path: 'missingReportId',
                select: '_id creatorId date itemDescription itemImage itemName location reportStatus reportType',
                populate: {
                    path: 'creatorId',
                    select: 'pic name email membership specification facebookLink phoneNumber twitterLink uid',
                },
            })
            .populate({
                path: 'foundReportId',
                select: '_id creatorId date itemDescription itemImage itemName location reportStatus reportType',
                populate: {
                    path: 'creatorId',
                    select: 'pic name email membership specification facebookLink phoneNumber twitterLink uid',
                },
            });

        const foundReportId = claimedReport.foundReportId._id
        const missingReportId = claimedReport.missingReportId._id
        
        // Update the reportStatus of the found report to "Claimed"
        found = await Report.findByIdAndUpdate(foundReportId, {
            $set: { reportStatus: "Claimable" }
        });

        // Update the reportStatus of the missing report to "Claimed"
        missing = await Report.findByIdAndUpdate(missingReportId, {
            $set: { reportStatus: "Missing" }
        });

        // Confirm if user exists
        if(!claimedReport) {
            return res.status(400).json({ message: 'Report was not found' })
        }

        // Delete the user from the database
        claimedReport = await claimedReport.deleteOne()

        return res.status(200).json(claimedReport);

    } catch (error) {
        console.log(error);
        next(error);
    }
})

module.exports = { getAllClaimedReport, getClaimedReportInfo, getClaimedReportById, createClaimedReport, deleteClaimedReport };