export const secondsToHMS = (seconds) => {
  var hours = Math.floor(seconds / 3600) > 0 ? Math.floor(seconds / 3600) + ' hours ' : '';
  var minutes =
    Math.floor((seconds % 3600) / 60) > 0 ? Math.floor((seconds % 3600) / 60) + ' minutes ' : '';
  var remainingSeconds = Math.floor(seconds % 60);

  return hours + minutes + remainingSeconds + ' seconds';
};

export const shuffle = (prevarray) => {
  let array = [...prevarray];
  let currentIndex = array.length,
    randomIndex;

  // While there are elements remaining to shuffle
  while (currentIndex !== 0) {
    // Pick a random index
    randomIndex = Math.floor(Math.random() * currentIndex);
    [array[currentIndex - 1], array[randomIndex]] = [array[randomIndex], array[currentIndex - 1]];

    currentIndex--;
  }

  return array;
};

export const msToTime = (duration) => {
  const date = new Date(duration);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

export const filterData = (dataList, searchValue, field) => {
  let newDataList =
    searchValue.length > 0
      ? dataList.filter((data) => data[field]?.toLowerCase()?.includes(searchValue))
      : dataList;

  return newDataList;
};
