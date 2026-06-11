import { pool } from '../src/config/database.js';

let originalQuery;
let originalConnect;
let queryHandler;
let connectHandler;

export function createMockClient(queryImpl) {
  return {
    queries: [],
    async query(sql, params) {
      this.queries.push({ sql, params });
      if (queryImpl) {
        return queryImpl(sql, params, this);
      }
      return { rows: [] };
    },
    release() {},
  };
}

export function installPoolMock() {
  originalQuery = pool.query.bind(pool);
  originalConnect = pool.connect.bind(pool);

  pool.query = async (sql, params) => {
    if (queryHandler) {
      return queryHandler(sql, params);
    }
    return { rows: [] };
  };

  pool.connect = async () => {
    if (connectHandler) {
      return connectHandler();
    }
    return createMockClient();
  };
}

export function restorePoolMock() {
  if (originalQuery) {
    pool.query = originalQuery;
  }
  if (originalConnect) {
    pool.connect = originalConnect;
  }
  queryHandler = null;
  connectHandler = null;
}

export function onPoolQuery(handler) {
  queryHandler = handler;
}

export function onPoolConnect(handler) {
  connectHandler = handler;
}
