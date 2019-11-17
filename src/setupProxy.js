const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/todos',
    proxy({
      target: 'http://localhost:4000',
      changeOrigin: true,
    })
  );
};
