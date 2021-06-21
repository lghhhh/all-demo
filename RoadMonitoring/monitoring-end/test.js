function getDataWeekAgo() {
  const weekMilliSeconds = 7 * 24 * 3600 * 1000;
  const weekDate = Date.now() - weekMilliSeconds;
  const date = new Date(weekDate);
  const year = date.getFullYear();
  const mounth = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${mounth > 9 ? mounth : '0' + mounth}-${
    day > 9 ? day : '0' + day
  }`;
}

const a = getDataWeekAgo();
console.log(JSON.stringify(a));
