export const filterFalsyValue = (data) => {
  let newData = {};
  for (const key in data) {
    if (data[key]) {
      newData[key] = data[key];
    }
  }
  return newData;
};
