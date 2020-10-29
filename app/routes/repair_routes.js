const express = require('express')
const passport = require('passport')
const Repair = require('../models/repair.js')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

router.get('/repairs', requireToken, (req, res, next) => {
  Repair.find({owner: req.user._id})
    .then(repairs => {
      return repairs.map(repair => repair.toObject())
    })
    .then(repairs => res.status(200).json({ repairs: repairs }))
    .catch(next)
})

router.post('/repairs', requireToken, (req, res, next) => {
  req.body.repair.owner = req.user.id
  Repair.create(req.body.repair)
    .then(repair => {
      res.status(201).json({ repair: repair.toObject() })
    })
    .catch(next)
})

router.patch('/repairs/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.repair.owner
  Repair.findById(req.params.id)
    .then(handle404)
    .then(repair => {
      requireOwnership(req, repair)
      return repair.updateOne(req.body.repair)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

router.delete('/repairs/:id', requireToken, (req, res, next) => {
  Repair.findById(req.params.id)
    .then(handle404)
    .then(repair => {
      requireOwnership(req, repair)
      repair.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
