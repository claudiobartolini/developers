const mongoose = require('mongoose')

const appSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},  {
    timestamps: true
})

const App = mongoose.model('app', appSchema)

module.exports = App