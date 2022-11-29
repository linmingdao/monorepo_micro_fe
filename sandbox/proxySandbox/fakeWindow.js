// 【Object.getOwnPropertyDescriptor】：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor
// 【Object.freeze】：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
// 【Object.create(null)】：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
const rawObjectDefineProperty = Object.defineProperty;
function createFakeWindow(globalContext = window) {
  const propertiesWithGetter = new Map();
  const fakeWindow = Object.create(null);

  Object.getOwnPropertyNames(globalContext)
    .filter((p) => {
      const descriptor = Object.getOwnPropertyDescriptor(globalContext, p);
      // 考虑性能，不复制 window 身上不可配置的属性（即：不可被删除和修改）
      return !descriptor?.configurable;
    })
    .forEach((p) => {
      const descriptor = Object.getOwnPropertyDescriptor(globalContext, p);
      if (descriptor) {
        const hasGetter = Object.prototype.hasOwnProperty.call(
          descriptor,
          'get',
        );

        if (['top', 'parent', 'window', 'self'].includes(p)) {
          descriptor.configurable = true;
          if (!hasGetter) {
            descriptor.writable = true;
          }
        }

        if (hasGetter) propertiesWithGetter.set(p, true);

        rawObjectDefineProperty(fakeWindow, p, Object.freeze(descriptor));
      }
    });

  return {
    fakeWindow,
    propertiesWithGetter,
  };
}

export { createFakeWindow };
