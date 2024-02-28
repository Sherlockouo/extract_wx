// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const convert = require('./wx_article_extract');

// Home
fastify.get('/', function handler (request, reply) {
  
  reply.send({ msg: 'Server is running!' })
})

// extract wx
fastify.post('/extract_from_wx_article', function handler (request, reply) {
    // https://mp.weixin.qq.com/s/
    const data = request.body;
    fastify.log.info("data ", data);
    if(data === undefined || data.url === undefined || ! data.url.startsWith('https://mp.weixin.qq.com/s/')){
        reply.code(400).send({ error: 'Bad Request' });
        return;
    }
    convert.convertToMarkdown(data.url).then((markdown) => {
        reply.send({ msg: markdown });
    }).catch((err) => {
        fastify.log.error(err);
        reply.code(500).send({ error: 'Internal Server Error' });
    });
  })

// Run the server!
fastify.listen({ port: 3300,host:"0.0.0.0" }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})