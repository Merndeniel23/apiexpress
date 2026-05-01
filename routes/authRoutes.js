const router = require("express").Router();
const { create, getAll, update } = require('../controllers/itemcontroller');
const protect = require('../middleware/authmiddleware');

router.post("/", protect, create);
router.get("/", protect, getAll);
router.put("/:id", protect, update);
router.delete("/:id", protect, update);

module.exports = router;    

