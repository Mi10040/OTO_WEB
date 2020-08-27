export const listToMapKey = (map: any, key: string) => {
  if (!map[0]?.key) {
    return new Error('未带有key属性的数组');
  }
  let val: any;
  map.map((v: any, i: number) => {
    if (v.key === key) {
      return (val = map[i]);
    }
  });
  return val;
};
