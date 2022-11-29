class ProxySandbox {
  proxyWindow;
  isRunning = false;

  active() {
    this.isRunning = true;
  }

  inactive() {
    this.isRunning = false;
  }

  constructor() {
    const fakeWindow = Object.create(null);
    this.proxyWindow = new Proxy(fakeWindow, {
      set: (target, prop, value) => {
        if (this.isRunning) {
          target[prop] = value;
        }
        return true;
      },
      get: (target, prop) => {
        return prop in target ? target[prop] : window[prop];
      },
    });
  }
}

export { ProxySandbox };
