const path = require('path');
const fs = require('fs');

// 数组扁平化,循环引用会出现问题
function flattenArray(arr, pool = []) {
    arr.forEach(el => {
        if (el instanceof Array) {
            flattenArray(el, pool);
        } else {
            pool.push(el);
        }
    });
    return pool;
}

function walkDir(dir) {
    const walk = fs.readdirSync(dir);
    const walkArr = walk.map(file => {
        const fileState = fs.statSync(path.join(dir, file));
        if (fileState.isDirectory()) {
            return walkDir(path.join(dir, file))
        } else {
            return path.join(dir, file);
        }
    });
    return flattenArray(walkArr)
}

function mapRoute(routeRootDir) {
    if (!routeRootDir.endsWith(path.sep)) routeRootDir = routeRootDir + path.sep

    const route = walkDir(routeRootDir)
        .map(file => ({
            path: file,
            url: file.substring(routeRootDir.length, file.lastIndexOf('.'))
        }))
    return route;
}

// 约定的路由配置,暂时无法使用二级路由
const router = new(require('koa-router'))();
mapRoute(path.join(__dirname, 'controllers')).forEach(el => {
    const controllerConstructor = require(el.path);

    const controller = new controllerConstructor();
    const url = `/${el.url}`;

    if (controller.get) {
        router.get(url, controller.get)
        router.get(`${url}/:flag`, controller.get)
    }
    if (controller.post) {
        router.post(url, controller.post)
    }
    if (controller.put) {
        router.put(`${url}/:flag`, controller.put)
    }
    if (controller.patch) {
        router.patch(`${url}/:flag`, controller.patch)
    }
    if (controller.delete) {
        router.delete(`${url}/:flag`, controller.delete)
    }
})

module.exports = router;