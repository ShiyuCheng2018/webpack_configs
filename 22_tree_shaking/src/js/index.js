import { mul } from './text';
import '../css/index.css';

function sum(...args) {
  return args.reduce((p, c) => p + c, 0);
}

// eslint-disable-next-line
console.log(sum(1, 2, 3, 4, 5, 6,7,8,9));

// eslint-disable-next-line
console.log(mul(1, 2));
