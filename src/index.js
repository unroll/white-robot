const Koa = require('koa');

const app = new Koa();

app.use(ctx => {
    ctx.body = 'Hello Koa1';
});

app.listen(process.env.PORT || 8080);