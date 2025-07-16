const puppeteer = require('puppeteer');
const { execSync } = require('child_process');

(async () => {
  const url = 'https://github.com/NERDHEAD-lab/NERDHEAD-lab/blob/master/README.md';
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });

  // camo 이미지 src 추출
  const camoUrls = await page.$$eval('article.markdown-body img', imgs =>
    imgs.map(img => img.src).filter(src => src.startsWith('https://camo.githubusercontent.com/'))
  );

  await browser.close();

  console.log(`총 ${camoUrls.length}개 camo 이미지 발견`);
  for (const camoUrl of camoUrls) {
    try {
      console.log(`PURGE: ${camoUrl}`);
      // curl -X PURGE 실행
      const result = execSync(`curl -X PURGE ${camoUrl}`);
      const status = result.toString().trim();
      console.log(`    → HTTP status: ${status}`);
    } catch (e) {
      console.error(`    실패: ${camoUrl}`, e.message);
      throw e;
    }
  }
})();
