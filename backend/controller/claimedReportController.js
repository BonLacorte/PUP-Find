const Report = require('../models/Report')
const ClaimedReport = require('../models/ClaimedReport')
const asyncHandler = require('express-async-handler')
const cloudinary = require("../utils/cloudinary");
const mongoose = require('mongoose');

//@description     Get all claimed reports
//@route           GET /api/claimed-reports
//@access          Protected
const getAllClaimedReport = asyncHandler(async (req, res, next) => {
    const { search } = req.query;

    try {
        // Populate the ClaimedReport model
        const claimedReports = await ClaimedReport.find({})

        // Apply keyword filter to the populated fields
        const filteredReports = claimedReports.filter((claimedReport) => {
            return (
                claimedReport.foundReport.itemName.match(new RegExp(search, 'i')) ||
                claimedReport.missingReport.itemName.match(new RegExp(search, 'i')) ||
                claimedReport.missingReport.creator.name.match(new RegExp(search, 'i')) ||
                claimedReport.foundReport.creator.name.match(new RegExp(search, 'i'))
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
        console.log(`getClaimedReportInfo missingReportId req.params`, missingReportId);
        console.log(`getClaimedReportInfo foundReportId req.params`, foundReportId);

        // Find the claimed report that matches the provided IDs

        // const claimedReport = await ClaimedReport.find({})

        const claimedReport = await ClaimedReport.findOne({
            "missingReport._id": missingReportId,
            "foundReport._id": foundReportId
        })

        if (!claimedReport) {
            console.log('Claimed report not found', claimedReport)
            return res.status(404).json({ message: 'Claimed report not found' });
        }

        console.log(`getClaimedReportInfo claimedReport`, claimedReport);
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
        const { foundReport, missingReport } = req.body;

        console.log(`foundReport`, foundReport)
        console.log(`missingReport`, missingReport)

        // Extract itemImage data for foundReport
        const foundReportImages = !foundReport.itemImage || foundReport.itemImage === null || foundReport.itemImage.length === 0 ? null : foundReport.itemImage.map(image => ({
            public_id: image.public_id || '',
            url: image.url || '',
        }))

        // Extract itemImage data for missingReport
        const missingReportImages = !missingReport.itemImage || missingReport.itemImage === null || missingReport.itemImage.length === 0 ? null : missingReport.itemImage.map(image => ({
            public_id: image.public_id || '',
            url: image.url || '',
        }))


        // Create a new ClaimedReport document
        const claimedReport = await ClaimedReport.create({
            foundReport: {
                _id: foundReport.id,
                itemName: foundReport.itemName,
                itemImage: foundReportImages,
                date: foundReport.date,
                createdAt: foundReport.createdAt,
                location: foundReport.location,
                itemDescription: foundReport.itemDescription,
                creator: { 
                    name: foundReport.creatorId.name,
                    uid: foundReport.creatorId.uid,
                    email: foundReport.creatorId.email,
                    pic: {
                        public_id: foundReport.creatorId.pic.public_id,
                        url: foundReport.creatorId.pic.url,
                    },
                    phoneNumber: foundReport.creatorId.phoneNumber,
                    facebookLink: foundReport.creatorId.facebookLink,
                    twitterLink: foundReport.creatorId.twitterLink,
                    membership: foundReport.creatorId.membership,
                    specification: foundReport.creatorId.specification,
                },
                reportStatus: "Claimed",
                reportType: foundReport.reportType,
            },
            missingReport: {
                _id: missingReport.id,
                itemName: missingReport.itemName,
                itemImage: missingReportImages,
                date: missingReport.date,
                createdAt: missingReport.createdAt,
                location: missingReport.location,
                itemDescription: missingReport.itemDescription,
                creator: { 
                    name: missingReport.creatorId.name,
                    uid: missingReport.creatorId.uid,
                    email: missingReport.creatorId.email,
                    pic: {
                        public_id: missingReport.creatorId.pic.public_id,
                        url: missingReport.creatorId.pic.url,
                    },
                    phoneNumber: missingReport.creatorId.phoneNumber,
                    facebookLink: missingReport.creatorId.facebookLink,
                    twitterLink: missingReport.creatorId.twitterLink,
                    membership: missingReport.creatorId.membership,
                    specification: missingReport.creatorId.specification,
                },
                reportStatus: "Claimed",
                reportType: missingReport.reportType,
            },
        });

        // Update the reportStatus of the found report to "Claimed"
        console.log(`foundReport._id`, foundReport.id)
        await Report.findByIdAndUpdate(foundReport.id, {
            $set: {reportStatus: "Claimed" }
        });

        // Update the reportStatus of the missing report to "Claimed"
        console.log(`missingReport._id`,missingReport.id)
        await Report.findByIdAndUpdate(missingReport.id, {
            $set: { reportStatus: "Claimed" }
        });

        console.log(`complete claimedReport`, claimedReport)
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
        const claimedReportId = req.params.claimedReportId;

        // Find the claimed report by ID
        let claimedReport = await ClaimedReport.findById(claimedReportId);

        // Check if the claimed report exists
        if (!claimedReport) {
            return res.status(400).json({ message: 'Claimed Report not found' });
        }

        const foundReportId = claimedReport.foundReport._id;
        const missingReportId = claimedReport.missingReport._id;

        // Update the reportStatus of the found report to "Claimable"
        await Report.findByIdAndUpdate(foundReportId, { $set: { reportStatus: 'Claimable' } });

        // Update the reportStatus of the missing report to "Missing"
        await Report.findByIdAndUpdate(missingReportId, { $set: { reportStatus: 'Missing' } });

        // Delete the claimed report
        await ClaimedReport.findByIdAndDelete(claimedReportId);

        res.status(200).json({ message: 'Claimed Report deleted successfully' });
    } catch (error) {
        console.log(error);
        next(error);
    }
});


module.exports = { getAllClaimedReport, getClaimedReportInfo, getClaimedReportById, createClaimedReport, deleteClaimedReport };