const puppeteer = require('puppeteer-core');
const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

const publicDir = path.join(__dirname, '../public');
const port = 9123;
const server = http.createServer((req, res) => {
  let requestPath = url.parse(req.url).pathname;
  if (requestPath === '/') requestPath = '/index.html';

  const filePath = path.join(publicDir, requestPath);
  if (!filePath.startsWith(publicDir)) {
    res.statusCode = 403;
    return res.end('Forbidden');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      return res.end('Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const types = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2'
    };

    res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
    res.end(data);
  });
});

function listen(port) {
  return new Promise((resolve, reject) => {
    server.listen(port, '127.0.0.1', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function close() {
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

(async () => {
  await listen(port);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/google-chrome-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    const resumeUrl = `http://127.0.0.1:${port}/`;
    await page.goto(resumeUrl, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: path.join(publicDir, 'Chase_Resume.pdf'),
      format: 'Letter',
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      printBackground: true
    });

    console.log('PDF generated successfully: Chase_Resume.pdf');
  } finally {
    await browser.close();
    await close();
  }
})();
