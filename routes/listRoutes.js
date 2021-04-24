const express = require('express');
const listController = require('../controllers/listController');

const router = express.Router();

router.get('/favicon.ico', listController.favicon_request)

router.get("/", listController.list_index);

router.get("/:customListName", listController.list_create_get);

router.post('/', listController.list_item_post);

router.post("/makeList", listController.list_create_post);

router.post('/delete', listController.list_delete);

module.exports = router;