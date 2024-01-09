/**
 * Service class that connects to the YouTube Data API v3
 *
 * @class YouTubeService
 */
export default class YouTubeService {
  /**
   * Creates a new instance of YouTubeService.
   *
   * @constructor
   * @param {Object} axios - Reference to the axios object.
   * @param {String} token - The token for the YouTube Data API v3.
   * @param {String} baseUrl - The base URL for the YouTube Data API v3.
   */
  constructor(axios, token, baseUrl) {
    this.axios = axios;
    this.token = token;
    this.baseUrl = baseUrl;
  }

  /**
   * Function to assist with returning videos using the YouTube Data API v3.
   *
   * @param {String} query - The search query for a video.
   * @returns {Promise<Object>} - An object with matching video results.
   * @throws {Error} - if there are no matching results or YouTube Data API cannot connect.
   */
  async searchVideos(query) {
    try {
      const response = await this.axios.get(`${this.baseUrl}/search`, {
        params: {
          q: query,
          key: this.token,
          part: "snippet",
          type: "video",
        },
      });
      return response.data.items;
    } catch (error) {
      console.error("Error fetching data from YouTube API:", error);
      throw error;
    }
  }

  /**
   * Function to assist with returning video details using the YouTube Data API v3.
   *
   * @param {String} videoId - The id of the video wrapped in single quotes on this example URL: www.youtube.com/watch?v='jNQXAC9IVRw'
   * @returns {Promise<Object>} - An object containing specific Youtube video details.
   * @throws {Error} - if a videoId is invalid or YouTube Data API cannot connnect.
   */
  async getVideoDetails(videoId) {
    try {
      const response = await this.axios.get(`${this.baseUrl}/videos`, {
        params: {
          id: videoId,
          key: this.token,
          part: "snippet,contentDetails",
        },
      });
      return response.data.items[0];
    } catch (error) {
      console.error("Error fetching data from YouTube API:", error);
      throw error;
    }
  }

  /**
   * Helper function to help transform result from searchVideos method to become more readable.
   *
   * @param {String} searchTerm - The searchTearm for a video.
   * @param {Object} tunebatData - The data webscraped from tunebat containing bpm/key information about a song.
   * @returns {Object} - An object containing information related to the first song.
   */
  getFirstResult(searchTerm, tunebatData) {
    const firstVideo = searchTerm[0];

    if (!firstVideo) {
      return null;
    }

    return {
      id: firstVideo.id.videoId,
      name: firstVideo.snippet.title,
      url: `https://www.youtube.com/watch?v=${firstVideo.id.videoId}`,
      img: firstVideo.snippet.thumbnails.default.url,
      tunebatData,
    };
  }

  /**
   * Helper function to help transform results from searchVideos method to become more readable.
   *
   * @param {String} searchTerm - The searchTearm for a video.
   * @param {Object} tunebatData - The data webscraped from tunebat containing bpm/key information about a song.
   * @returns {Array<Object>} - An array of objects containing information related to a song.
   */
  getAllResults(searchTerm, tunebatData) {
    const firstVideo = searchTerm[0];

    if (!firstVideo) {
      return null;
    }

    return searchTerm.map((video) => ({
      id: video.id.videoId,
      name: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      img: video.snippet.thumbnails.default.url,
      tunebatData,
    }));
  }
}
