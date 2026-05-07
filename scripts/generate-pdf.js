const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Load the current built homepage so the PDF reflects the newest resume content.
  const resumePath = path.join(__dirname, '../public/index.html');
  const resumeUrl = `file://${resumePath}`;
  await page.goto(resumeUrl, { waitUntil: 'networkidle0' });
  
  await page.pdf({
    path: path.join(__dirname, '../public/Chase_Resume.pdf'),
    format: 'Letter',
    margin: {
      top: '0.5in',
      right: '0.5in',
      bottom: '0.5in',
      left: '0.5in'
    },
    printBackground: true
  });
  
  await browser.close();
  console.log('PDF generated successfully: Chase_Resume.pdf');
})();
