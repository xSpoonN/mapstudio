const express = require('express')
const router = express.Router()
const MapController = require('../controllers/map-controller')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/maps', MapController.createMap)
router.delete('/maps/:id', MapController.deleteMapById)
router.get('/maps/:id', MapController.getMapById)
// router.put('/maps/:id', MapController.updateMapInfoById)
router.put('/maps/:id', MapController.updateMapFileById)
router.get('/user/:id', MapController.getMapsByUser)
router.get('/publishedmaps', MapController.getPublishedMaps)
router.get('/landing/:id', MapController.getLandingMaps)
router.put('/mapschema/:id', MapController.updateMapSchema)
router.get('/mapschema/:id', MapController.getMapSchema)

module.exports = router
