const puppeteer = require("puppeteer");
const { JSDOM } = require("jsdom");

async function getContactInfo(query) {
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
      const responseSource = await fetchsearchUrl(url);
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

  async function searchUrl(url) {
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

  async function fetchsearchUrl(url) {
    response_sourcecode = await searchUrl(url);
    return response_sourcecode;
  }

  async function searchGoogle(query) {
    // Launch the browser
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to Google search
    await page.goto("https://www.google.com");
    await page.waitForSelector("input[name=q]");

    // Enter the search query and submit
    await page.type("input[name=q]", query);
    await page.keyboard.press("Enter");

    // Wait for search results to load
    await page.waitForSelector("#search a");

    // Extract the main search result links
    const links = await page.$$eval("#search a", (anchorElements) =>
      anchorElements.map((anchor) => ({
        title: anchor.textContent,
        url: anchor.href,
      }))
    );

    // Filter out unnecessary links (like Google's own services)
    const filteredLinks = links.filter(
      (link) =>
        !link.url.includes("google.com") &&
        !link.url.includes("javascript:void(0)")
    );

    // Close the browser
    await browser.close();

    return filteredLinks;
  }
  /* const url = `https://www.newmont.com/about-us/contact-us/default.aspx`; */
  // Usage example:
  async function getsiteText(url) {
    // Fetcher = clean text result
    const fetcher = await URLFetcher.createInstance(url, true);
    siteText = fetcher.getTextContent();
    return siteText;
  }

  async function goThroughUrls(results) {
    let siteText = "";
    for (let i = 0; i < 3; i++) {
      siteText += await getsiteText(results[i].url);
    }
    return siteText;
  }

  async function main(query) {
    try {
      const results = await searchGoogle(query);
      const compiledSiteTexts = await goThroughUrls(results);
      return compiledSiteTexts;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  main(query).then((compiledSiteTexts) => {
    if (compiledSiteTexts) {
      /* console.log(compiledSiteTexts); */
    } else {
      console.log("An error occurred while processing the query");
    }
  });
  return compiledSiteTexts;
}

getContactInfo("De La Salle University Dasmarinas Contact Information");
