const fetch = require('node-fetch');

describe('controller tests for API', () => {
  test('ping route should return status code 200', async () => {
    const res = await fetch(`http://localhost:8080/api/ping`);
    expect(res.status).toEqual(200);
  });

  test('ping route body should return success true', async () => {
    const res = await fetch(`http://localhost:8080/api/ping`);
    expect(await res.json()).toEqual({ success: true });
  });

  test('invalid ping route should return a 404', async () => {
    const res = await fetch(`http://localhost:8080/api/pin`);
    expect(res.status).toEqual(404);
  });

  test('empty tags should return an error', async () => {
    const res = await fetch(`http://localhost:8080/api/posts/`);

    const data = await res.json();
    expect(data.error).toEqual('tags parameter is required');
  });

  test('invalid direction parameter should return an error', async () => {
    const res = await fetch(
      `http://localhost:8080/api/posts/history/id/sideways`
    );

    const data = await res.json();

    expect(data.error).toEqual('direction parameter is invalid');
  });

  test('invalid sortBy parameter should return an error', async () => {
    const res = await fetch(`http://localhost:8080/api/posts/history/nonsense`);

    const data = await res.json();
    expect(data.error).toEqual('sortBy parameter is invalid');
  });

  test('invalid posts route should return an error', async () => {
    const res = await fetch(`http://localhost:8080/api/post/history/nonsense`);

    expect(res.status).toEqual(404);
  });

  test('valid posts route should return status code 200', async () => {
    const res = await fetch(
      `http://localhost:8080/api/posts/history/likes/desc`
    );

    expect(res.status).toEqual(200);
  });

  test('valid posts route should return properly sorted data', async () => {
    const res = await fetch(
      `http://localhost:8080/api/posts/history,tech/likes/desc`
    );

    data = await res.json();

    let likes = [];
    let flag = true;

    for (post of data.posts) {
      likes.push(post.likes);
    }
    for (let i = 0; i < likes.length; i++) {
      if (likes[i + 1] > likes[i]) {
        flag = false;
        break;
      }
    }

    expect(flag).toEqual(true);
  });

  test('valid posts route should not return duplicate data - checking using id', async () => {
    const res = await fetch(
      `http://localhost:8080/api/posts/history,tech,science`
    );

    data = await res.json();

    let ids = [];
    let flag = true;

    for (post of data.posts) {
      if (ids.includes(post.id)) {
        flag = false;
        break;
      }
      ids.push(post.id);
    }

    expect(flag).toEqual(true);
  });

  test('valid posts route should sort by id in ascending order by default', async () => {
    const res = await fetch(`http://localhost:8080/api/posts/history,tech`);

    data = await res.json();

    let ids = [];
    let flag = true;
    let lastId;
    for (post of data.posts) {
      ids.push(post.id);
    }

    lastId = ids[0];
    for (id of ids) {
      if (id < lastId) {
        flag = false;
        break;
      }
      lastId = id;
    }

    expect(flag).toEqual(true);
  });
});
