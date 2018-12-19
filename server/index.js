const express = require('express');
const cheerio = require('cheerio');
const fs = require('fs');
const popupsJson = require('../public/popups.json');

const port = process.env.PORT || 5500;

const app = express();
const clientPath = `${__dirname}/../public`;

const indexHtml = fs.readFileSync(`${clientPath}/index.html`, 'utf8');
const baseUrl = '/100dni/';
const values = Object.values(popupsJson);

values.forEach((value) => {
  app.get(`${baseUrl}${value.link}`, async (req, res) => {
    try {
      const $ = cheerio.load(indexHtml);
      const og = value.og || {};

      $([
        'meta[property="og:url"]',
      ].join(',')).remove();

      $('head').append(`
        <meta property="og:url" content="https://danesjenovdan.si${baseUrl}${value.link}">
      `);

      if (og.title) {
        $([
          'title',
          'meta[property="og:title"]',
          'meta[name="twitter:title"]',
        ].join(',')).remove();

        $('head').append(`
          <title>${og.title}</title>
          <meta property="og:title" content="${og.title}">
          <meta name="twitter:title" content="${og.title}">
        `);
      }

      if (og.image) {
        $([
          'meta[property="og:image"]',
          'meta[name="twitter:image"]',
        ].join(',')).remove();

        $('head').append(`
          <meta property="og:image" content="https://danesjenovdan.si${baseUrl}${og.image}">
          <meta name="twitter:image" content="https://danesjenovdan.si${baseUrl}${og.image}">
        `);
      }

      if (og.desc) {
        $([
          'meta[property="og:description"]',
          'meta[name="twitter:description"]',
        ].join(',')).remove();

        $('head').append(`
          <meta property="og:description" content="${og.desc}">
          <meta name="twitter:description" content="${og.desc}">
        `);
      }

      res.send($.html());
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      res.status(500).send('Something went wrong');
    }
  });
});

app.use(`${baseUrl}`, express.static(clientPath));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
