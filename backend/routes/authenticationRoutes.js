const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authenticateToken = require('../middleware/authenticateToken');
const Application = require('../models/Application');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', authenticateToken, upload.single('resume'), async (req, res) => {
  const { name, email, domain } = req.body;
  const application = new Application({
    userId: req.user.id,
    name,
    email,
    domain,
    resume: req.file.filename
  });
  await application.save();
  res.json({ message: 'Application submitted' });
});

router.get('/status', authenticateToken, async (req, res) => {
  const exists = await Application.findOne({ userId: req.user.id });
  res.json({ applied: !!exists });
});

module.exports = router;
