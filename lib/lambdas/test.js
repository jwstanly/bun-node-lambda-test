function toughSorting() {
  const start = Date.now();

  const arr = [];
  for (let j = 0; j < 1e5; j++) {
    arr.push(Math.random());
  }
  arr.sort();

  const end = Date.now();

  return end - start;
}

exports.getTestResult = function () {
  return `${process.env.RUNTIME} result: ${toughSorting()}`;
};
