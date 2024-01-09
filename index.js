import axios from "axios";
import { chromium } from "playwright";
import PlaywrightService from "./services/playwright-service.js";
import { Downloader } from "ytdl-mp3";
import TunebatService from "./services/tunebat-service.js";
import YouTubeService from "./services/youtube-service.js";
import DJAutomationRunnerService from "./dj-automation-runner-service.js";
import yargs from "yargs";
import dotenv from "dotenv";

dotenv.config();

/**
 * Main method and point of entry of DJ-Automation project.
 *
 * @param {String} searchTerm - The search query.
 */
export default async function main(searchTerm) {
  try {
    const playwrightService = new PlaywrightService(chromium);

    const tunebatService = new TunebatService(
      process.env.TUNEBAT_BASE_URL,
      playwrightService,
    );

    const youtubeService = new YouTubeService(
      axios,
      process.env.YOUTUBE_TOKEN,
      process.env.YOUTUBE_BASE_URL,
    );

    const downloader = new Downloader({ getTags: false });

    const djAutomationRunnerService = new DJAutomationRunnerService(
      tunebatService,
      youtubeService,
      downloader,
    );

    djAutomationRunnerService.run(searchTerm);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

/**
 * Main configuration to pass arguments when using the command line.
 */
const argv = yargs(process.argv.slice(2)).argv;

const searchTermList = argv._;

if (searchTermList.length > 0) {
  for (const search of searchTermList) {
    await main(search);
  }
} else {
  console.log(`Please provide search term(s) as command-line argument(s)\n
    Single-Search command: node index.js "curbi vertigo"\n
    Multi-Search command: node index.js "gorgon city voodoo" "sonny fodera closer"`);
}
