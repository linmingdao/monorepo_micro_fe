import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import {
  evalute,
  LegacySandbox,
  SnapshotSandbox,
  ProxySandbox,
} from '@ryuk/sandbox';
import vm from 'vm-browserify';

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

function testProxySandbox() {
  window.xage = 11;

  const proxySandbox01 = new ProxySandbox();
  const proxySandbox02 = new ProxySandbox();
  proxySandbox01.active();
  proxySandbox02.active();
  proxySandbox01.proxyWindow.xage = 100;
  proxySandbox02.proxyWindow.xage = 200;

  console.log(
    window.xage,
    proxySandbox01.proxyWindow.xage,
    proxySandbox02.proxyWindow.xage,
  );

  proxySandbox01.inactive();
  proxySandbox02.inactive();

  console.log(
    window.xage,
    proxySandbox01.proxyWindow.xage,
    proxySandbox02.proxyWindow.xage,
  );
}

function testVmBrowserify() {
  const code = `
  function test(a) {
    window.xageage = 111;
    console.log('sandbox inner:', window);
    return a + 5;
  }
  test(a);
  console.log('sandbox inner:', window.xageage);
  // 如果最后一个是表达式 或者 函数调用有返回值，那么会给外部调用者（即会赋值给 res）
  3;
  `;
  var res = vm.runInNewContext(code, { a: 100 });
  console.log('outter:', res);
}

// testEvalute();
// testSnapshotSandbox();
// testLegacySandbox();
// testProxySandbox();
// testVmBrowserify();
