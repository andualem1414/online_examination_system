export const secondsToHMS = (seconds) => {
  var hours = Math.floor(seconds / 3600) > 0 ? Math.floor(seconds / 3600) + ' hours ' : '';
  var minutes =
    Math.floor((seconds % 3600) / 60) > 0 ? Math.floor((seconds % 3600) / 60) + ' minutes ' : '';
  var remainingSeconds = seconds % 60;

  return hours + minutes + remainingSeconds + ' seconds';
};
