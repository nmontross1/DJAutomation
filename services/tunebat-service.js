/**
 * Service class that connects to https://tunebat.com/
 *
 * @class TunebatService
 */
export default class TunebatService {
  /**
   * Creates a new instance of TunebatService.
   *
   * @param {String} baseUrl - The baseUrl for accessing tunebat.
   * @param {Object} playwrightService - The reference to the playwright service class.
   */
  constructor(baseUrl, playwrightService) {
    this.baseUrl = baseUrl;
    this.playwrightService = playwrightService;
  }

  /**
   * Function to assist with retrieving song information from tunebat using the playwright web scraping * library.
   *
   * @param {String} query - The search query to search for on tunebat.
   * @returns {Object} - The data object containing key/bpm information about a song from tunebat.
   */
  async getTunebatData(query) {
    const config = {
      artist: ".ant-typography-ellipsis._2zAVA",
      title: ".ant-typography-ellipsis-multiple-line.aZDDf",
      key: ".k43JJ:nth-child(1) .lAjUd",
      bpm: ".k43JJ:nth-child(2) .lAjUd",
      camelotKey: ".k43JJ:nth-child(3) .lAjUd",
      popularity: ".k43JJ:nth-child(4) .lAjUd",
    };

    return await this.playwrightService.initializePlaywright(
      this.baseUrl,
      config,
      query,
    );
  }
}
