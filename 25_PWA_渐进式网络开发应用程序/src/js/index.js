import { mul } from './text';
import '../css/index.css';

function sum(...args) {
  return args.reduce((p, c) => p + c, 0);
}

// eslint-disable-next-line
console.log(sum(1, 2, 3, 4, 5, 6,7,8,9));

// eslint-disable-next-line
console.log(mul(1, 2));

/*
*  1. eslint不认识window， navigator等全局变量
*     解决：需要修改package.json中eslintConfig配置
*  "env": {
*       "browser": true // 支持浏览器全局变量
*   }`
*
*   2. sw代码必须运行在服务器上
*     --> node.js
*     -->
*       npm i serve -g
*       server -s build 启动服务器， 将build目录下所有资源作为静态资源去暴露出去
* */
// 注册serviceworker
// 处理兼容性问题
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => {
        console.log('sw注册成功了');
      })
      .catch(() => {
        console.log('sw注册失败了');
      });
  });
}
