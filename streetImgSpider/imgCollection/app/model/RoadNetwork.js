'use strict'
module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const RoadNetwork = new Schema(
        {
            fileName: { type: String, required: true },
            fileId: { type: String, required: true },
            sseLayerIndex: { type: Array, required: true },
        },
        {
            timestamps: { createdAt: 'created_at', updatedAt: 'update_at' },
        }
    );
    return mongoose.model('RoadNetwork', RoadNetwork, 'RoadNetwork')

}