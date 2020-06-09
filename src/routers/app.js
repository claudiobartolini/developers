const express = require('express')
const App = require('../models/app')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/apps', auth, async (req, res) => {
    const app = new App({
        ...req.body,
        owner: req.user._id
    })

    try {
        await app.save()
        res.status(201).send(app)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET /apps?completed=true
// GET /apps?limit=10&skip=10
// GET /apps?sortBy=createdAt:asc
router.get('/apps', auth, async (req, res) => {
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
            path: 'apps',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.apps)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/apps/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const app = await App.findOne({ _id, owner: req.user._id })

        if (!app) {
            return res.status(404).send()
        }

        res.send(app)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/apps/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const app = await App.findOne({ _id: req.params.id, owner: req.user._id})

        if (!app) {
            return res.status(404).send()
        }

        updates.forEach((update) => app[update] = req.body[update])
        await app.save()
        res.send(app)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/apps/:id', auth, async (req, res) => {
    try {
        const app = await App.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!app) {
            res.status(404).send()
        }

        res.send(app)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router