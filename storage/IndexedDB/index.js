export function testIndexedDB() {
  // 创建 or 打开数据库
  const idbRequest = window.indexedDB.open('testDB');

  idbRequest.onsuccess = function (event) {
    console.log('onsuccess', event);
    addPersonData(event.target.result);
    readPersonData(event.target.result);
    // readAllPerson(event.target.result);
    useIndex(event.target.result);
  };

  idbRequest.onupgradeneeded = function (event) {
    // 数据库版本升级时候会调用该事件（第一次创建数据库，也会调）
    console.log('onupgradeneeded', event);
    // 创建对象仓库（类似表的概念）
    createPersonStore(event.target.result);
  };

  idbRequest.onerror = function (event) {
    console.log('onerror', event);
  };

  function createPersonStore(db) {
    let objectStore;
    if (!db.objectStoreNames.contains('person')) {
      // 创建对象仓库（类似表的概念）
      //   objectStore = db.createObjectStore('person', { keyPath: 'id' });
      objectStore = db.createObjectStore('person', { autoIncrement: true });
      // 新建索引
      objectStore.createIndex('name', 'name', { unique: false });
      objectStore.createIndex('email', 'email', { unique: false });
    } else {
      objectStore = db.objectStoreNames['person'];
    }

    return objectStore;
  }

  function addPersonData(db) {
    const request = db
      .transaction(['person'], 'readwrite')
      .objectStore('person')
      .add({ id: 1, name: '张三', email: 'zhangsan@example.com', age: 24 });

    request.onsuccess = function (event) {
      console.log('数据写入成功', event);
    };

    request.onerror = function (event) {
      console.log('数据写入失败', event);
    };
  }

  function readPersonData(db) {
    const transaction = db.transaction(['person']);
    const objectStore = transaction.objectStore('person');
    const request = objectStore.get(1);

    request.onerror = function (event) {
      console.log('事务失败');
    };

    request.onsuccess = function (event) {
      if (request.result) {
        console.log('Name: ' + request.result.name);
        console.log('Age: ' + request.result.age);
        console.log('Email: ' + request.result.email);
      } else {
        console.log('未获得数据记录');
      }
    };
  }

  function readAllPerson(db) {
    const objectStore = db.transaction('person').objectStore('person');

    objectStore.openCursor().onsuccess = function (event) {
      const cursor = event.target.result;

      if (cursor) {
        console.log('Id: ' + cursor.key);
        console.log('Name: ' + cursor.value.name);
        console.log('Age: ' + cursor.value.age);
        console.log('Email: ' + cursor.value.email);
        cursor.continue();
      } else {
        console.log('没有更多数据了！');
      }
    };
  }

  function updatePerson(db) {
    const request = db
      .transaction(['person'], 'readwrite')
      .objectStore('person')
      .put({ id: 1, name: '李四', age: 35, email: 'lisi@example.com' });

    request.onsuccess = function (event) {
      console.log('数据更新成功');
    };

    request.onerror = function (event) {
      console.log('数据更新失败');
    };
  }

  function removePerson(db) {
    const request = db
      .transaction(['person'], 'readwrite')
      .objectStore('person')
      .delete(1);

    request.onsuccess = function (event) {
      console.log('数据删除成功');
    };
  }

  // 使用索引
  function useIndex(db) {
    var transaction = db.transaction(['person'], 'readonly');
    var store = transaction.objectStore('person');
    var index = store.index('name');
    var request = index.get('张三');

    request.onsuccess = function (e) {
      var result = e.target.result;
      if (result) {
        console.log(result);
      } else {
        console.log('nothing');
      }
    };
  }
}
