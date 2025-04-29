const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const app = require("../app/api")
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data")
const db = require("../db/connection")
const request = require("supertest")
// const treasureData = require("../db/data/test-data/treasures")
/* Set up your beforeEach & afterAll functions here */


beforeEach(() => seed(testData))
afterAll(() => db.end())

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  it("200: responds with an array of topic objects, each with slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBeGreaterThan(0);

        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String)
            })
          );
        });
      });
  });
});
