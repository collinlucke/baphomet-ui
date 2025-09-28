// import puppeteer from 'puppeteer';

// export const getLetterboxdRating = async ({ tmdbId }: { tmdbId: string }) => {
//   const url = `https://letterboxd.com/tmdb/${tmdbId}/`;
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(url, { waitUntil: 'networkidle2' });

//   const rating = await page.$eval('.tooltip .display-rating', el =>
//     el.textContent.trim()
//   );
//   console.log('Rating:', rating);

//   await browser.close();
//   return rating;
// };

import puppeteer from 'puppeteer';

export const getLetterboxdRating = async tmdbId => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://letterboxd.com/tmdb/${tmdbId}/`, {
    waitUntil: 'networkidle2'
  });
  // const content = await page.content();
  // console.log(content);
  const rating = await page.$eval('.average-rating', el =>
    el.textContent.trim()
  );
  console.log('Rating:', rating);

  await browser.close();
};
