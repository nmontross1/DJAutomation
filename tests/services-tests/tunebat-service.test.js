import TunebatService from "../../services/tunebat-service.js";
import PlaywrightService from "../../services/playwright-service.js";

jest.mock("../../services/playwright-service.js");

const baseUrl = "https://tunebat.com/";

describe("TunebatService", () => {
  let tunebatService, playwrightService;

  beforeEach(() => {
    playwrightService = new PlaywrightService({});
    tunebatService = new TunebatService(baseUrl, playwrightService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getTunebatData", () => {
    it("is a function", async () => {
      expect(tunebatService.getTunebatData).toBeInstanceOf(Function);
    });

    describe("when it succeeds", () => {
      it("calls initalizePlaywright from the PlaywrightService", async () => {
        await tunebatService.getTunebatData("query");
        expect(playwrightService.initializePlaywright).toHaveBeenCalled();
      });

      it("returns the expected data object from the playwright service", async () => {
        jest
          .spyOn(playwrightService, "initializePlaywright")
          .mockResolvedValue({
            artist: "John Doe",
            title: "Sample Song",
            key: "C Major",
            bpm: "120",
            camelotKey: "8A",
            popularity: "100",
          });

        const result = await tunebatService.getTunebatData("John Doe");

        expect(result).toEqual({
          artist: "John Doe",
          title: "Sample Song",
          key: "C Major",
          bpm: "120",
          camelotKey: "8A",
          popularity: "100",
        });
      });
    });

    describe("when it errors", () => {
      it("returns null if the playwright service returns null", async () => {
        jest
          .spyOn(playwrightService, "initializePlaywright")
          .mockResolvedValue(null);

        const result = await tunebatService.getTunebatData("query");

        expect(result).toBeNull();
      });

      it("handles errors and returns null", async () => {
        jest
          .spyOn(playwrightService, "initializePlaywright")
          .mockRejectedValue(new Error("Error:"));

        try {
          await tunebatService.getTunebatData("query");
        } catch (error) {
          expect(error.message).toBe("Error:");
        }
      });
    });
  });
});
