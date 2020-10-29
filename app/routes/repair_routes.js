// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for repair
const Repair = require('../models/repair.js')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { repair: { title: '', text: 'foo' } } -> { repair: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /repairs
router.get('/repairs', requireToken, (req, res, next) => {
  Repair.find({owner: req.user._id})
    .then(repairs => {
      // `repairs` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return repairs.map(repair => repair.toObject())
    })
    // respond with status 200 and JSON of the repairs
    .then(repairs => res.status(200).json({ repairs: repairs }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW - not used in front end
// GET /repairs/5a7db6c74d55bc51bdf39793
router.get('/repairs/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Repair.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "repair" JSON
    .then(repair => res.status(200).json({ repair: repair.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /repairs
router.post('/repairs', requireToken, (req, res, next) => {
  // set owner of new repair to be current user
  req.body.repair.owner = req.user.id

  Repair.create(req.body.repair)
    // respond to succesful `create` with status 201 and JSON of new 'repair'
    .then(repair => {
      res.status(201).json({ repair: repair.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /repairs/5a7db6c74d55bc51bdf39793
router.patch('/repairs/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.repair.owner

  Repair.findById(req.params.id)
    .then(handle404)
    .then(repair => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, repair)

      // pass the result of Mongoose's `.update` to the next `.then`
      return repair.updateOne(req.body.repair)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /repairs/5a7db6c74d55bc51bdf39793
router.delete('/repairs/:id', requireToken, (req, res, next) => {
  Repair.findById(req.params.id)
    .then(handle404)
    .then(repair => {
      // throw an error if current user doesn't own `repair`
      requireOwnership(req, repair)
      // delete the repair ONLY IF the above didn't throw
      repair.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
