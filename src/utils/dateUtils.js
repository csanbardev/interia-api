/**
 * Parse a Youtube formatted date into mariadb formatted date
 * @param {String} dateString 
 * @returns 
 */
export const extractYoutubeDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}