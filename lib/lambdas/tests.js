exports.tests = [
  {
    name: 'sort-once',
    test: () => {
      const arr = [];
      for (let j = 0; j < 1e5; j++) {
        arr.push(Math.random());
      }
      arr.sort();
    },
  },
  {
    name: 'sort-many',
    test: () => {
      const arr = [];
      for (let j = 0; j < 1e4; j++) {
        arr.push(Math.random());
        arr.sort();
      }
    },
  },
];
