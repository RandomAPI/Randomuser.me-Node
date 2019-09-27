const store = {};

module.exports = {
  set(key, value) {
    store[key] = value;
  },
  get(key) {
    if (key in store) return store[key];
    else return undefined;
  },
  remove(key) {
    delete store[key];
  },
};