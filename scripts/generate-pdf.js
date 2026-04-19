const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Read the resume HTML
  const resumePath = path.join(__dirname, '../public/resume-pdf.html');
  const fileContent = fs.readFileSync(resumePath, 'utf8');
  
  await page.setContent(fileContent);
  
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
