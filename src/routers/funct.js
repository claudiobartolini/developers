const express = require('express')
const validator = require('validator')
const Funct = require('../models/funct')
const auth = require('../middleware/auth')
const router = new express.Router()

// // TODO: mock server
// router.post('/functions', async (req, res) => {
//     const data = {
//         id: '234s54cbb98029f3d',
//         invocationURL: 'http://' + (req.body || 'awesome-alfie') + '.boxfunction.online'
//     }
//     console.log(data)
//     res.send(data)
// })

router.post('/functions', auth, async (req, res) => {
    const invocationURL = 'http://' + req.body.name + process.env.FUNCTIONS_DOMAIN
    if (!validator.isURL(invocationURL)) {
        console.log(invocationURL)
        return res.status(400).send({ error: 'Invalid function name' })
    }
    const funct = new Funct({
        ...req.body,
        owner: req.user._id,
        invocationURL
    })

    try {
        await funct.save()
        res.status(201).send(funct)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET /functions?completed=true
// GET /functions?limit=10&skip=10
// GET /functions?sortBy=createdAt:asc
router.get('/functions', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        await req.user.populate({
            path: 'functs',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.functs)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/functions/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const funct = await App.findOne({ _id, owner: req.user._id })

        if (!funct) {
            return res.status(404).send()
        }

        res.send(funct)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/functions/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const funct = await App.findOne({ _id: req.params.id, owner: req.user._id})

        if (!funct) {
            return res.status(404).send()
        }

        updates.forEach((update) => funct[update] = req.body[update])
        await funct.save()
        res.send(funct)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/functions/:id', auth, async (req, res) => {
    try {
        const funct = await App.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!funct) {
            res.status(404).send()
        }

        res.send(funct)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router