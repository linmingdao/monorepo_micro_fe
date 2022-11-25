function isPropConfigurable(target, prop) {
  const descriptor = Object.getOwnPropertyDescriptor(target, prop);
  return descriptor ? descriptor.configurable : true;
}

class LegacySandbox {
  // 持续记录对全局环境的更新操作（新增 和 修改）
  currentUpdatePropsValueMap = new Map();

  constructor(name, globalContext = window) {
    this.name = name;
    this.sandboxRunning = true;
    this.globalContext = globalContext;
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

      this.sandboxRUnning = true;
    }
  }

  inactive() {}
}
