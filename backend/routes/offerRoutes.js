const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const path = require('path');
const puppeteer = require('puppeteer');
const Application = require('../models/Application');
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/generate-pdf', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const application = await Application.findOne({ userId });
    const user = await User.findById(userId);

    if (!application || !user) {
      return res.status(403).json({ error: 'Application or User not found' });
    }

    const startDate = new Date(application.applicationDate || Date.now());
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const html = await ejs.renderFile(
      path.join(__dirname, '../views/offerLetter.ejs'),
      {
        name: user.name,
        domain: application.domain,
        startDate: startDate.toDateString(),
        endDate: endDate.toDateString()
      }
    );

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=OfferLetter.pdf'
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('🔥 PDF generation failed:', err);
    res.status(500).send('Error generating PDF');
  }
});

module.exports = router;




