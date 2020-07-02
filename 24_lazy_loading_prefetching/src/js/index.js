console.log("index.js 已被加载");

import {mul} from "./test"


document.getElementById("btn").onClick = function(){
    // 懒加载： 但文件需要使用时才加载
    // prefetch: 预加载， 在使用之前加载js文件。 等其他资源加载完毕， 浏览器空闲了，在进行加载
    // 正常加载可以认为是并行加载 （同一时间加载多个文件）
    import(/* webpackChunkName: "test", webpackPrefetch: true */'./test')
        .then(({mul})=>{
            console.log(mul(8 * 9));
        })
};