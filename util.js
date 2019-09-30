function getDateTime(daysBack = 0) {
  const date = new Date(new Date().getTime() - 86400000 * daysBack);
  const year = date.getFullYear();

  let month = date.getMonth() + 1;
  month = (month < 10 ? '0' : '') + month;

  let day  = date.getDate();
  day = (day < 10 ? '0' : '') + day;

  return year + '-' + pad(month, 2) + '-' + pad(day, 2);
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

module.exports = {
  getDateTime,
  pad
};