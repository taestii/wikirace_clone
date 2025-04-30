import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const siteScheme = new Schema({
    startSite: {
    title: String,
    url: String,
    required: true
    },
    endSite: {
    title: String,
    url: String,
    required: true
    },
    visitedSites: {
    type: [String],
    default: []
    }
});

const SiteData = model('SiteData', siteScheme);
module.exports = SiteData;

