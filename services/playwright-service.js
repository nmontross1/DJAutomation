/**
 * Service class that uses the playwright library.
 *
 * @class PlaywrightService
 */
export default class PlaywrightService {
  /**
   * Creates a new instance of PlaywrightService
   *
   * @param {Object} chromium - The chosen browser to perform the webscrape.
   */
  constructor(chromium) {
    this.chromium = chromium;
  }

  /**
   * Main function to initalize the playwright library.
   *
   * @param {String} url - The website url being targeted to webscrape.
   * @param {Object} config - The page objects being targeted.
   * @param {String} query - The search query.
   * @returns {Object} The data object based on the config.
   */
  async initializePlaywright(url, config, query) {
    let browser, page;

    try {
      browser = await this.chromium.launch({ headless: true });
      const context = await browser.newContext({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      });
      page = await context.newPage();

      await page.goto(`${url}${encodeURIComponent(query)}`);

      // Check if the page is still open and not navigated away
      if (!page.isClosed()) {
        // Wait for any ongoing navigations to complete
        await page.waitForNavigation({ waitUntil: "domcontentloaded" });

        const data = await this.scrapeData(page, config, query);

        if (!data) {
          return null;
        }

        return data;
      } else {
        console.error("Error: Page is closed or navigated away.");
        return null;
      }
    } catch (error) {
      console.error("Error:", error.message);
      return null;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * Helper function to scrape data from a specific webpage using the playwright library using querySelector.
   *
   * @param {Object} page - The website's page in browser.
   * @param {Object} config - The page objects being targeted.
   * @param {String} query - The search query.
   * @returns {Object} The data object based on the config.
   */
  async scrapeData(page, config, query) {
    const result = await page.evaluate((config) => {
      const data = {};

      for (const [key, selector] of Object.entries(config)) {
        const element = document.querySelector(selector);

        if (!element) {
          console.error(
            `No matching element for ${key} in the result for ${query}.`,
          );
          return null;
        }

        data[key] = element.innerText.trim();
      }

      return data;
    }, config);

    return result;
  }
}
