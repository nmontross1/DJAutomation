import { chromium } from "playwright";
import PlaywrightService from "../../services/playwright-service.js";

jest.mock("playwright");

describe("PlaywrightService", () => {
  let playwrightService, mockBrowser, mockPage;

  beforeEach(() => {
    mockPage = {
      isClosed: jest.fn().mockReturnValue(false),
      goto: jest.fn().mockResolvedValue({}),
      waitForNavigation: jest.fn().mockResolvedValue({}),
      evaluate: jest.fn(),
    };

    mockBrowser = {
      launch: jest.fn().mockResolvedValue({}),
      newContext: jest
        .fn()
        .mockResolvedValue({ newPage: jest.fn().mockReturnValue(mockPage) }),
      close: jest.fn(),
    };

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    playwrightService = new PlaywrightService(chromium);
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("initializePlaywright", () => {
    it("is a function", async () => {
      expect(playwrightService.initializePlaywright).toBeInstanceOf(Function);
    });

    describe("when it succeeds", () => {
      it("returns scraped data", async () => {
        const mockData = { artist: "John Doe", title: "Sample Song" };

        jest.spyOn(playwrightService, "scrapeData").mockResolvedValue(mockData);
        playwrightService.chromium.launch.mockResolvedValue(mockBrowser);

        const result = await playwrightService.initializePlaywright(
          "https://example.com/",
          {},
          "query",
        );

        expect(result).toEqual(mockData);
        expect(mockBrowser.close).toHaveBeenCalled();
      });
    });

    describe("when it errors", () => {
      it("returns null if page is closed or navigated away", async () => {
        mockPage.isClosed.mockReturnValue(true);
        playwrightService.chromium.launch.mockResolvedValue(mockBrowser);

        const result = await playwrightService.initializePlaywright(
          "https://example.com/",
          {},
          "query",
        );

        expect(result).toBeNull();
        expect(mockBrowser.close).toHaveBeenCalled();
      });
      it("handles errors and returns null", async () => {
        const error = new Error("Mock Error");
        jest.spyOn(playwrightService, "scrapeData").mockRejectedValue(error);
        playwrightService.chromium.launch.mockResolvedValue(mockBrowser);

        const result = await playwrightService.initializePlaywright(
          "https://example.com/",
          {},
          "query",
        );

        expect(result).toBeNull();
        expect(mockBrowser.close).toHaveBeenCalled();
      });
    });
  });

  describe("scrapeData", () => {
    it("is a function", async () => {
      expect(playwrightService.scrapeData).toBeInstanceOf(Function);
    });

    describe("when it succeeds", () => {
      it("returns scraped data", async () => {
        const mockConfig = {
          artist: ".artist-selector",
          title: ".title-selector",
        };
        mockPage.evaluate.mockResolvedValue({
          artist: "John Doe",
          title: "Sample Song",
        });

        const result = await playwrightService.scrapeData(
          mockPage,
          mockConfig,
          "query",
        );

        expect(result).toEqual({ artist: "John Doe", title: "Sample Song" });
      });
    });

    describe("when it errors", () => {
      it("returns null if no matching element is found", async () => {
        mockPage.evaluate.mockResolvedValue(null);

        const result = await playwrightService.scrapeData(
          mockPage,
          {},
          "query",
        );

        expect(result).toBeNull();
      });
    });
  });
});
