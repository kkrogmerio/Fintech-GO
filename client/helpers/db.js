import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("graduationProject.db");

export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMARY KEY NOT NULL,address TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL);",
        [],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        }
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY NOT NULL,title TEXT NOT NULL, content TEXT NOT NULL);",
        [],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        }
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS news (id INTEGER PRIMARY KEY NOT NULL,title TEXT NOT NULL, company TEXT NOT NULL,url TEXT NOT NULL);",
        [],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

export const insertPlace = (address, lat, lng) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO places (address, lat, lng) VALUES (?, ?, ?);`,
        [address, lat, lng],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

export const fetchPlaces = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM places",
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};
export const insertNote = (content, title) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO notes (content,title) VALUES (?, ?);`,
        [content, title],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

export const updateNote = (id, title, content) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `update notes SET title=?,content=? WHERE id=?`,
        [title, content, id],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};
export const deleteNote = (id) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `delete FROM notes where id=?`,
        [id],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};
export const fetchNotes = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM notes",
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};
export const fetchNews = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM news",
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};
export const insertNews = (title, company, url) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO news (title,company,url) VALUES (?,?,?);`,
        [title, company, url],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};
