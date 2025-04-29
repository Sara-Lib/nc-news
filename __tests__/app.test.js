const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const app = require("../app/api")
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data")
const db = require("../db/connection")
const request = require("supertest")
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

describe('GET /api/articles/:article_id', () => {
  test('200: returns article with all correct fields', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          })
        );
      });
  });

  test('404: article not found', () => {
    return request(app)
      .get('/api/articles/9999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found');
      });
  });

  test('400: invalid ID format', () => {
    return request(app)
      .get('/api/articles/not-an-id')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid article ID');
      });
  });
});

describe('GET /api/articles', () => {
  test('200: returns array of articles with correct properties and comment_count', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number)
            })
          );
        });
      });
    });
    
    test('there should not be a body property present on any of the article objects', () => {
      return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
          const { articles } = body;
          expect(articles).not.toHaveProperty('body'); 
        });
  });

  test('articles are sorted by created_at date in descending order', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const dates = body.articles.map((a) => new Date(a.created_at));
        const sorted = [...dates].sort((a, b) => b - a);
        expect(dates).toEqual(sorted);
      });
  });

});
