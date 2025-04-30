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

describe('GET /api/articles/:article_id/comments', () => {
  test('200: returns an array of comments for the given article_id with correct properties', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 1
            })
          );
        });
      });
  });

  test('comments are sorted by created_at in descending order', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        const dates = body.comments.map((c) => new Date(c.created_at));
        const sorted = [...dates].sort((a, b) => b - a);
        expect(dates).toEqual(sorted);
      });
  });

  test('400: responds with "Invalid article ID" if article_id is not a number', () => {
    return request(app)
      .get('/api/articles/not-a-number/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid article ID');
      });
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  test('201: posts a new comment and responds with the comment', () => {
    const newComment = {
      username: 'icellusedkars',
      body: 'This article is amazing!'
    };

    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: 'This article is amazing!',
            author: 'icellusedkars',
            article_id: 1,
            created_at: expect.any(String),
            votes: 0
          })
        );
      });
  });

  test('400: missing required fields (username or body)', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({ username: 'jessjelly' }) // missing body
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Missing required fields');
      });
  });

  test('404: non-existent article ID', () => {
    return request(app)
      .post('/api/articles/9999/comments')
      .send({ username: 'jessjelly', body: 'Nice!' })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found');
      });
  });

  test('400: invalid article ID', () => {
    return request(app)
      .post('/api/articles/jelly/comments')
      .send({ username: 'jessjelly', body: 'Nice!' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid article ID');
      });
  });
});
