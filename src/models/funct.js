const mongoose = require('mongoose')

const functSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true
    },
    appClientID: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    invocationURL: {
        type: String,
        required: true
    }
},  {
    timestamps: true
})

const Funct = mongoose.model('funct', functSchema)

module.exports = Funct