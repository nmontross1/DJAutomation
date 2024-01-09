import ora from "ora";
import he from "he";
/**
 * Runner service for the DJ-Automation project.
 *
 * @class DJAutomationRunnerService
 */
export default class DJAutomationRunnerService {
  /**
   * Creates a new instance of DJAutomationRunnerService.
   *
   * @param {Object} tunebatService - Reference to the TunebatService class.
   * @param {Object} youtubeService - Reference to the YoutubeService class.
   * @param {Object} downloader - Reference to the ytdl-mp3 object.
   */
  constructor(tunebatService, youtubeService, downloader) {
    this.tunebatService = tunebatService;
    this.youtubeService = youtubeService;
    this.downloader = downloader;
  }

  /**
   * Main method for the DJAutomationRunnerService that when given a search term retrieves data about
   * the search term from tunebat, finds the video on youtube, and downloads it as an mp3 and saves to * your Downloads folder.
   *
   * @param {String} searchTerm - The search query.
   * @returns {File} - Returns a YouTube video in mp3 format and gets the Extended Mix version.
   */
  async run(searchTerm) {
    const tunebatSpinner = ora(
      `Searching for ${searchTerm} on Tunebat\n`,
    ).start();

    const tunebatData = await this.tunebatService.getTunebatData(searchTerm);

    tunebatSpinner.succeed(
      `Successfully retrieved data from Tunebat!\n${JSON.stringify(
        tunebatData,
        null,
        2,
      )}\n`,
    );

    const youtubeSpinner = ora(
      `Searching for ${tunebatData.artist} - ${tunebatData.title} on YouTube`,
    ).start();

    const youtubeSearch = await this.youtubeService.searchVideos(searchTerm);

    const firstYoutubeResult = this.youtubeService.getFirstResult(youtubeSearch, tunebatData);

    if (firstYoutubeResult) {
      console.log(
        `Result found for ${he.decode(firstYoutubeResult.name)}:\n${JSON.stringify(
          firstYoutubeResult,
          null,
          2,
        )}\n`,
      );

      youtubeSpinner.succeed("Successfully retrieved data from Youtube!\n");

      const downloadSpinner = ora(
        `Downloading ${he.decode(firstYoutubeResult.name)} from Youtube\n`,
      ).start();

      await this.downloader.downloadSong(firstYoutubeResult.url);

      downloadSpinner.succeed("Successfully converted Youtube video to MP3!\n");
    } else {
      console.log("No result found on YouTube.");
    }
  }
}
