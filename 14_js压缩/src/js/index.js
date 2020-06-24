// import '@babel/polyfill';


const add = (x,y) =>{
  return x + y;
}


// 下一行不进行任何eslint检查
// eslint-disable-next-line
console.log(add(2, 5));

const promise = new Promise((resolve)=>{
    setTimeout(()=> {
        console.log("it is the time!")
        resolve();
    }, 1000)
})

console.log(promise)

