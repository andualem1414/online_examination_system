// Conver second to Hours Minutes and Seconds
export const secondsToHMS = (seconds) => {
  var hours = Math.floor(seconds / 3600) > 0 ? Math.floor(seconds / 3600) + ' hours ' : '';
  var minutes =
    Math.floor((seconds % 3600) / 60) > 0 ? Math.floor((seconds % 3600) / 60) + ' minutes ' : '';
  var remainingSeconds = Math.floor(seconds % 60);

  return hours + minutes + remainingSeconds + ' seconds';
};

// Shuffle an array
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

// Convert milliseconds to readable time
export const msToTime = (duration) => {
  const date = new Date(duration);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

// Filter data based on search parameters
export const filterData = (dataList, searchValue, field) => {
  let newDataList =
    searchValue.length > 0
      ? dataList.filter((data) => data[field]?.toLowerCase()?.includes(searchValue))
      : dataList;

  return newDataList;
};

// filter data that is older than a week
export const olderThanWeek = (date) => {
  const today = new Date().getTime();
  const checkDate = new Date(date).getTime();

  const timeDifference = today - checkDate;
  const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;

  return timeDifference < oneWeekInMilliseconds;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month (0-indexed)
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
