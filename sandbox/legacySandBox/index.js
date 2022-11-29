function isPropConfigurable(target, prop) {
  const descriptor = Object.getOwnPropertyDescriptor(target, prop);
  return descriptor ? descriptor.configurable : true;
}

class LegacySandbox {
  constructor(name, globalContext = window) {
    this.name = name;
    this.sandboxRunning = true;
    this.globalContext = globalContext;

    // 持续记录对全局环境的更新操作（新增 和 修改）
    this.currentUpdatePropsValueMap = new Map();
    // 沙箱期间新增的全局变量
    this.addedPropsMapInSandbox = new Map();
    // 沙箱期间更新的全局变量
    this.modifiedPropsOriginalValueMapInSandbox = new Map();

    const rawWindow = globalContext;
    const fakeWindow = Object.create(null); // 通过Object.create(null)构造一个纯净的空对象，甚至都没有原型

    const setTrap = (p, value, originalValue, sync2Window = true) => {
      if (this.sandboxRUnning) {
        // 细分对全局环境的修改
        if (!rawWindow.hasOwnProperty(p)) {
          // 微应用运行期间新增的属性
          this.addedPropsMapInSandbox.set(p, value);
        } else if (!this.modifiedPropsOriginalValueMapInSandbox.has(p)) {
          // 不是新增变量，那就是微应用运行期间更新的全局变量，但是只记录最原始的值
          this.modifiedPropsOriginalValueMapInSandbox.set(p, originalValue);
        }

        // 所有的操作都可以被归位对全局环境的修改
        this.currentUpdatePropsValueMap.set(p, value);

        if (sync2Window) {
          // 必须重新设置 window 对象保证下次 get 时能拿到已更新的数据
          rawWindow[p] = value;
        }

        return true;
      }
      return true;
    };

    // proxy 机制防逃逸
    this.proxy = new Proxy(fakeWindow, {
      set(_, p, value) {
        const originalValue = rawWindow[p];
        return setTrap(p, value, originalValue, true);
      },
      get(_, p) {
        if (['top', 'parent', 'window', 'self'].includes(p)) {
          return proxy;
        }
        const value = rawWindow[p];
        return value;
      },
      has(_, p) {
        return p in rawWindow;
      },
      // getOwnPropertyDescriptor(_, p) {
      //   const descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);
      //   return descriptor;
      // },
      // defineProperty(_, p, descriptor) {},
    });
  }

  setWindowProp(prop, value, toDelete) {
    if (value === undefined && toDelete) {
      delete this.globalContext[prop];
    } else if (isPropConfigurable(this.globalContext, prop)) {
      this.globalContext[prop] = value;
    }
  }

  active() {
    if (!this.sandboxRunning) {
      // 全局环境恢复到上一次运行的状态
      this.currentUpdatePropsValueMap.forEach((v, p) =>
        this.setWindowProp(p, v),
      );
    }

    this.sandboxRUnning = true;
  }

  inactive() {
    // 还原微应用运行期间window上原有的属性
    this.modifiedPropsOriginalValueMapInSandbox.forEach((v, p) =>
      this.setWindowProp(p, v),
    );
    // 删除微应用运行期间window上新增的属性
    this.addedPropsMapInSandbox.forEach((_, p) =>
      this.setWindowProp(p, undefined, true),
    );

    this.sandboxRUnning = false;
  }
}

export { LegacySandbox };
