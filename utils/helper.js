export const filterFalsyValue = (data) => {
  let newData = {};
  for (const key in data) {
    if (data[key]) {
      newData[key] = data[key];
    }
  }
  return newData;
};

export const convertDataDetail = (dataArray) => {
  const newDataArray = dataArray.map((data) => {
    const newData = {};

    for (const key in data) {
      if (
        typeof data[key] === "object" &&
        data[key] !== null &&
        "id" in data[key]
      ) {
        newData[key] = data[key].id;
      } else {
        newData[key] = data[key];
      }
    }

    return newData;
  });

  return newDataArray;
};
