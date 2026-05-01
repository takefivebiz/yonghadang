// This script automates the form submission for testing
// Run with: node test-form-submission.js

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  try {
    console.log('📱 Navigating to analyze page...');
    await page.goto('http://localhost:3000/analyze?type=self', { waitUntil: 'networkidle2' });

    // Capture console logs
    page.on('console', msg => {
      if (msg.type() === 'log') {
        console.log('🔵 Browser:', msg.text());
      } else if (msg.type() === 'error') {
        console.error('🔴 Browser Error:', msg.text());
      }
    });

    // Click 연애 button
    console.log('💕 Clicking 연애 category...');
    await page.click('button:has-text("연애")').catch(() => {
      return page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('연애'));
        if (btn) btn.click();
      });
    });

    await page.waitForTimeout(500);

    // Click 썸 subcategory
    console.log('👫 Clicking 썸 subcategory...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === '썸');
      if (btn) btn.click();
    });

    // Click through 8 questions
    for (let i = 1; i <= 8; i++) {
      console.log(`❓ Question ${i}...`);

      await page.waitForTimeout(300);

      // Click first option
      await page.evaluate(() => {
        const options = Array.from(document.querySelectorAll('button, label'));
        const firstOpt = options.find(el =>
          el.textContent && el.textContent.length > 5 &&
          !el.textContent.includes('다음') &&
          !el.textContent.includes('이전')
        );
        if (firstOpt) {
          firstOpt.click?.() || firstOpt.parentElement?.click?.();
        }
      });

      await page.waitForTimeout(200);

      // Click next/submit button
      const buttonText = i === 8 ? '분석 완료' : '다음';
      await page.evaluate((text) => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === text);
        if (btn) {
          console.log('Clicking:', text);
          btn.click();
        }
      }, buttonText);
    }

    // Wait for redirect
    console.log('⏳ Waiting for redirect...');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});

    const finalUrl = page.url();
    console.log('✅ Final URL:', finalUrl);

    if (finalUrl.includes('report')) {
      const sessionId = finalUrl.split('/').pop().split('?')[0];
      console.log('📄 Session ID:', sessionId);

      if (sessionId.startsWith('sess_demo')) {
        console.log('❌ Got DUMMY session ID!');
      } else if (sessionId.length === 36 && sessionId.includes('-')) {
        console.log('✅ Got REAL UUID session ID!');
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
