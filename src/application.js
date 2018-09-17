const path = require('path');
const views = require('koa-views');
const static = require('koa-static');

const Koa = require('koa');
const app = new Koa();

app.use(views(path.join(__dirname, '..', 'dist'), { extension: 'html' }));
app.use(static(path.join(__dirname, '..', 'dist')));

app.use(async (ctx) => {
    await ctx.render('index')
})

console.log(`listen http://localhost:${process.env.PORT || 3000}`);
app.listen(process.env.PORT || 3000);