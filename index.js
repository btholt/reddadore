require('babel/register')({
  ignore: false,
  only: /.+(?:(?:\.es6\.js)|(?:.jsx))$/,
  extensions: ['.js', '.es6.js', '.jsx' ],
  sourceMap: true,
});

var fs = require('fs');
var template = fs.readFileSync('./template.html', 'utf8');
var React = require('react');
var reddadore = React.createFactory(require('./reddadore.jsx'));
var koa = require('koa');
var app = koa();
var router = require('koa-router')();

router.get('/', function *(next) {
  var markup = React.renderToStaticMarkup(reddadore());
  this.set('Content-Type', 'text/html');
  this.body = template.split("<%= body %>").join(markup);
});


app.use(require('koa-static')('public', {}));

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
console.log('listening on port 3000');