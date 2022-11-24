import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { evalute, SnapshotSandbox } from '@ryuk/sandbox';

createApp(App).mount('#app');

function testEvalute() {
  const a = evalute('1+2');
  console.log(a);
  evalute('console.log(1)');
  console.log(evalute('let c=2;let a=c+1;d = 1;window.xxx = 123;return a;'));
  console.log(c);
}

function testSnapshotSandbox() {
  console.log(window.xname, window.xage); // undefined,undefined
  const sandbox = new SnapshotSandbox();
  sandbox.active();
  // 污染全局
  window.xname = '张三';
  window.xage = 18;
  console.log(window.xname, window.xage); // 张三,18
  sandbox.inactive(); // 还原
  console.log(window.xname, window.xage); // undefined,undefined
  sandbox.active(); // 激活
  console.log(window.xname, window.xage); // 张三,18
}

// testEvalute();
// testSnapshotSandbox();
