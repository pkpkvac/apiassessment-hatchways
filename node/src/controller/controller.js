const fetch = require('node-fetch');
const schema = require('../validation/schema');

const ping = (req, res) => {
  res.status(200).send({ success: true }).end();
};

const posts = async (req, res) => {
  const { error, value } = schema.validate({
    tags: req.params.tags,
    sortBy: req.params.sortBy,
    direction: req.params.direction,
  });

  if (error) {
    res
      .status(400)
      .send({
        error: error.message,
      })
      .end();
    return;
  }
  try {
    const tags = value.tags.split(',');

    const uniqueBlogPostsMap = new Map();
    const uniqueBlogPosts = [];
    const requests = [];

    const sortBy = value.sortBy ? value.sortBy : 'id';
    const direction = value.direction ? value.direction : 'asc';

    tags.forEach((tag) => {
      requests.push(
        `https://api.hatchways.io/assessment/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`
      );
    });

    let jsonArray = await Promise.all(requests.map((url) => fetch(url))).then(
      async (res) => {
        return Promise.all(res.map(async (data) => await data.json()));
      }
    );

    for (let tagNum = 0; tagNum < jsonArray.length; tagNum++) {
      for (let post = 0; post < jsonArray[tagNum].posts.length; post++) {
        uniqueBlogPostsMap.set(
          jsonArray[tagNum].posts[post].id,
          jsonArray[tagNum].posts[post]
        );
      }
    }

    for (const [k, v] of uniqueBlogPostsMap) {
      uniqueBlogPosts.push(v);
    }

    uniqueBlogPosts.sort((a, b) => {
      if (a[sortBy] > b[sortBy]) {
        if (direction === 'desc') {
          return -1;
        } else {
          return 1;
        }
      }
      if (a[sortBy] < b[sortBy]) {
        if (direction === 'desc') {
          return 1;
        } else {
          return -1;
        }
      }
      return 0;
    });

    res.status(200).send({ posts: uniqueBlogPosts });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Something went wrong' });
  }
};

module.exports = { ping, posts };
