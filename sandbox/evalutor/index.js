function evalute(code, sandbox) {
  // new Function 可以访问全局环境，会污染全局空间 -> 借助【with】+【proxy】-> 防逃逸
  const fn = new Function('sandbox', `with(sandbox){${code}}`);
  const proxy = new Proxy(sandbox || Object.create(null), {
    has(target, key) {
      console.log(target, key);
      return true;
    },
  });
  return fn(proxy);
}

export { evalute };
