import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { evalute, LegacySandbox, SnapshotSandbox } from '@ryuk/sandbox';

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

  // 进入微应用
  const sandbox = new SnapshotSandbox();
  sandbox.active();
  window.xname = '张三';
  window.xage = 18;
  console.log(window.xname, window.xage); // 张三,18

  // 退出微应用
  sandbox.inactive(); // 还原
  console.log(window.xname, window.xage); // undefined,undefined

  // 进入微应用
  sandbox.active(); // 激活
  console.log(window.xname, window.xage); // 张三,18
}

function testLegacySandbox() {
  window.xcity = 'Beijing';
  console.log(window.xcity);

  const legacySandbox = new LegacySandbox();
  legacySandbox.active();
  legacySandbox.proxy.xcity = 'Shanghai';
  console.log(window.xcity);

  legacySandbox.inactive();
  console.log(window.xcity);

  legacySandbox.active();
  console.log(window.xcity);
}

// testEvalute();
// testSnapshotSandbox();
// testLegacySandbox();
