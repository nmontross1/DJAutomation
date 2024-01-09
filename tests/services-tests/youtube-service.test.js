import axios from "axios";
import YouTubeService from "../../services/youtube-service.js";

jest.mock("axios");

describe("YouTubeService", () => {
  let youtubeService, query, videoId;

  beforeEach(() => {
    const token = "your-api-key";
    const baseUrl = "https://www.googleapis.com/youtube/v3";
    youtubeService = new YouTubeService(axios, token, baseUrl);

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("searchVideos", () => {
    it("is a function", async () => {
      expect(youtubeService.searchVideos).toBeInstanceOf(Function);
    });

    describe("when it succeeds", () => {
      it("searches for videos and returns a response object", async () => {
        const mockResponse = {
          data: {
            items: [
              {
                kind: "youtube#searchResult",
                etag: "1L_8ieM8-Njb5mrHIcKpUNfRMww",
                id: { kind: "youtube#video", videoId: "Secelj2ud7Q" },
                snippet: {
                  /* various snippet properties */
                },
              },
            ],
          },
        };

        axios.get.mockResolvedValue(mockResponse);

        query = "Mr. Beast";

        const response = await youtubeService.searchVideos(query);

        expect(response).toEqual(mockResponse.data.items);
      });
    });

    describe("when it errors", () => {
      it("throws an error if YouTube Data API cannot connect", async () => {
        axios.get.mockRejectedValue(new Error("API connection error"));

        await expect(youtubeService.searchVideos("test")).rejects.toThrowError(
          "API connection error",
        );
      });

      it("throws an error if there are no matching results", async () => {
        const mockResponse = {
          data: {
            items: [],
          },
        };

        axios.get.mockRejectedValue(new Error("No matching results found"));

        await expect(
          youtubeService.searchVideos("nonexistent"),
        ).rejects.toThrowError("No matching results found");
      });
    });
  });

  describe("getVideoDetails", () => {
    it("is a function", async () => {
      expect(youtubeService.getVideoDetails).toBeInstanceOf(Function);
    });

    describe("when it succeeds", () => {
      it("retrieves video details when given an id", async () => {
        const mockResponse = {
          data: {
            items: [
              {
                kind: "youtube#searchResult",
                etag: "1L_8ieM8-Njb5mrHIcKpUNfRMww",
                id: { kind: "youtube#video", videoId: "Secelj2ud7Q" },
                snippet: {
                  /* various snippet properties */
                },
              },
            ],
          },
        };

        axios.get.mockResolvedValue(mockResponse);

        videoId = "Secelj2ud7Q";

        const response = await youtubeService.getVideoDetails(videoId);

        expect(response).toEqual(mockResponse.data.items[0]);
      });
    });

    describe("when it errors", () => {
      it("throws an error if YouTube Data API cannot connect", async () => {
        axios.get.mockRejectedValue(new Error("API connection error"));

        await expect(
          youtubeService.getVideoDetails("test"),
        ).rejects.toThrowError("API connection error");
      });

      it("throws an error if the videoId is invalid", async () => {
        const mockResponse = {
          data: {
            items: [],
          },
        };

        axios.get.mockRejectedValue(new Error("Invalid videoId"));

        await expect(
          youtubeService.getVideoDetails("invalidId"),
        ).rejects.toThrowError("Invalid videoId");
      });
    });
  });

  describe("getFirstResult", () => {
    it("is a function", async () => {
      expect(youtubeService.getFirstResult).toBeInstanceOf(Function);
    });

    describe("when it succeeds", () => {
      it("transforms results from searchVideos method call into an object with properties", async () => {
        const mockSearchTerm = [
          {
            id: {
              videoId: "exampleVideoId",
            },
            snippet: {
              title: "Example Video Title",
              thumbnails: {
                default: {
                  url: "exampleThumbnailUrl",
                },
              },
            },
          },
        ];

        const mockTunebatData = {
          artist: "Fred Flintstone",
          title: "Yabba Dabba Doo!",
          key: "D Major",
          bpm: "128",
          camelotKey: "10B",
          popularity: "100",
        };

        const expectedResult = {
          id: "exampleVideoId",
          name: "Example Video Title",
          url: "https://www.youtube.com/watch?v=exampleVideoId",
          img: "exampleThumbnailUrl",
          tunebatData: mockTunebatData,
        };

        const result = youtubeService.getFirstResult(
          mockSearchTerm,
          mockTunebatData,
        );

        expect(result).toEqual(expectedResult);
      });
    });

    describe("when it errors", () => {
      it("returns null if the first video is not available", async () => {
        const mockSearchTerm = [];
        const mockTunebatData = {
          artist: "Fred Flintstone",
          title: "Yabba Dabba Doo!",
          key: "D Major",
          bpm: "128",
          camelotKey: "10B",
          popularity: "100",
        };

        const result = youtubeService.getFirstResult(
          mockSearchTerm,
          mockTunebatData,
        );

        expect(result).toBeNull();
      });
    });
  });

  describe("getAllResults", () => {
    it("is a function", async () => {
      expect(youtubeService.getAllResults).toBeInstanceOf(Function);
    });

    describe("when it succeeds", () => {
      it("transforms results from searchVideos method call into an array of objects with properties", async () => {
        const mockSearchTerm = [
          {
            id: {
              videoId: "exampleVideoId",
            },
            snippet: {
              title: "Example Video Title",
              thumbnails: {
                default: {
                  url: "exampleThumbnailUrl",
                },
              },
            },
          },
        ];

        const mockTunebatData = {
          artist: "Fred Flintstone",
          title: "Yabba Dabba Doo!",
          key: "D Major",
          bpm: "128",
          camelotKey: "10B",
          popularity: "100",
        };

        const expectedResult = [
          {
            id: "exampleVideoId",
            name: "Example Video Title",
            url: "https://www.youtube.com/watch?v=exampleVideoId",
            img: "exampleThumbnailUrl",
            tunebatData: mockTunebatData,
          },
        ];

        const result = await youtubeService.getAllResults(
          mockSearchTerm,
          mockTunebatData,
        );

        expect(result).toEqual(expectedResult);
      });
    });

    describe("when it errors", () => {
      it("returns null if no videos are available", async () => {
        const mockSearchTerm = [];
        const mockTunebatData = {
          artist: "Fred Flintstone",
          title: "Yabba Dabba Doo!",
          key: "D Major",
          bpm: "128",
          camelotKey: "10B",
          popularity: "100",
        };

        const result = await youtubeService.getAllResults(
          mockSearchTerm,
          mockTunebatData,
        );

        expect(result).toBeNull();
      });
    });
  });
});
