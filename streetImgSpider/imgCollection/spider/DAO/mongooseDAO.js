'use strict'
const mongoose = require('mongoose')
//mongoose的Promise是mongoosse自己的 用ES6的进行替换
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://admin:admin123@localhost:27017/StreetImgdb')
const db = mongoose.connection;
db.on('error', (e) => { console.error('connection error:', e) });
db.once('open', () => {
    console.log('connection succeeded.')
});
const RoadNetwork = new mongoose.Schema(
    {
        CityId: { type: String, required: true },
        LinkName: { type: String, required: true },
        Type: { type: String, required: true },
        Level: { type: String, required: true },
        GeometryType: { type: String, required: true },
        GeometryCoordinates: { type: Array, required: true },
        CollectionStatus: { type: String, required: true },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'update_at' },
    }
);
const RoadNetworkModel = mongoose.model('RoadNetwork', RoadNetwork, 'RoadNetwork')

module.exports = { RoadNetworkModel }