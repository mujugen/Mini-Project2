const puppeteer = require("puppeteer");
const url = `https://www.dlsud.edu.ph/feedback.htm`;
const { JSDOM } = require("jsdom");

class URLFetcher {
  constructor(url, source, loadIframes = false) {
    this.url = url;
    this.loadIframes = loadIframes;
    this.source = source;

    if (this.loadIframes) {
      this.source += this.fetchIframes(this.source);
    }
  }

  static async createInstance(url, loadIframes = false) {
    const responseSource = await fetchSearchGoogle(url);
    return new URLFetcher(url, responseSource, loadIframes);
  }

  getSource() {
    return this.source;
  }

  getTextContent() {
    let text = this.source.slice(0, 50000);

    text = this.removeTags(["style", "script", "nav", "noscript"], text);

    text = text.replace(/<\/div>/g, "</div>\n");
    text = text.replace(/<\/p>/g, "</p>\n");
    text = text.replace(/<\/th>/g, "</th> ");
    text = text.replace(/<\/td>/g, "</td> ");
    text = text.replace(/<span/g, " <span");
    text = text.replace(/<\/span>/g, "</span> ");

    text = text.replace(/<[^>]+>/g, "");

    text = text.replace(/[^\S\r\n]+/g, " ");
    text = text.replace(/^.{0,20}$/gm, "");
    text = text.replace(/\n+/g, "\n");

    return text;
  }

  removeTags(tagNames, pageSource) {
    const dom = new JSDOM(pageSource);

    for (const tagName of tagNames) {
      const tags = dom.window.document.getElementsByTagName(tagName);
      for (const item of tags) {
        item.parentNode.removeChild(item);
      }
    }

    return dom.serialize();
  }

  fetchIframes(pageSource) {
    const dom = new JSDOM(pageSource);
    const iframes = dom.window.document.getElementsByTagName("iframe");
    let iframesSource = "";

    for (const iframe of iframes) {
      const url = iframe.getAttribute("src");

      if (
        !url ||
        url.includes("yimg") ||
        url.includes("googletagmanager") ||
        url.includes("googlesyndication") ||
        url.includes("/cross-domain") ||
        url.includes("adsystem") ||
        url.includes(".png") ||
        url.includes(".gif") ||
        url.includes(".jpg") ||
        url.includes(".jpeg")
      ) {
        continue;
      }

      // Fetch the iframe content using puppeteer_fetch.js and append it to iframesSource
      // Note: The actual fetching part needs to be updated accordingly
    }

    return iframesSource;
  }
}

// Usage example:
// const fetcher = new URLFetcher("https://example.com", true);
// console.log(fetcher.getTextContent());

async function searchGoogle(url) {
  // launch browser
  const browser = await puppeteer.launch({
    headless: true,
  });

  // open the url
  const page = await browser.newPage();
  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });
  } catch (error) {
    // i didn't want to wait that long anyway
  }

  // wait for website source to stabilize
  try {
    await page.waitForFunction(
      async () => {
        let html = document.body.innerHTML;
        await new Promise((_) => setTimeout(_, 2000));
        return document.body.innerHTML === html;
      },
      {
        timeout: 10000,
      }
    );
  } catch (error) {
    // i didn't want to wait that long anyway
  }

  // get html of page
  const html = await page.evaluate(() => {
    if (document.getElementsByTagName("main").length) {
      return document.getElementsByTagName("main")[0].innerHTML;
    }
    return document.body.innerHTML;
  });

  // close browser
  await browser.close();

  // print html
  return html;
}

async function fetchSearchGoogle(url) {
  response_sourcecode = await searchGoogle(url);
  return response_sourcecode;
}

// Usage example:
(async () => {
  // Fetcher = clean text result
  const fetcher = await URLFetcher.createInstance(url, true);
  console.log(fetcher.getTextContent());
})();
