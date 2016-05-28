/// <reference path="../typings/index.d.ts" />

export
const alphanum_range = (function() {
  const data = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
  return function (start, stop) {
    start = data.indexOf(start);
    stop = data.indexOf(stop);
    return (!~start || !~stop) ? null : data.slice(start, stop + 1);
  };
})();
