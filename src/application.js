const path = require('path');
const views = require('koa-views');
const static = require('koa-static');
const logger = require('koa-logger');
const router = require('./router');

const app = new(require('koa'))();


app.use(views(path.join(__dirname, '..', 'dist'), { extension: 'html' }));
app.use(static(path.join(__dirname, '..', 'dist')));
app.use(logger());

// 前端的静态文件路径有点问题
app.use(async (ctx, next) => {
    await ctx.render('index');
    await next(ctx, next);
})

app.use(router.routes()).use(router.allowedMethods());

console.log(`listen http://localhost:${process.env.PORT || 3000}`);
app.listen(process.env.PORT || 3000);