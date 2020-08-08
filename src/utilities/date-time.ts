/**
 * Produces timeStamp in hex
 */
export const createTimeStamp = (dateTime?: Date): string => {
  const now = (dateTime) ? (new Date(dateTime)).getTime() : Date.now();
  return now.toString(16);
}

/**
 * Decodes hex timeStamps to dates.
 */
export const decodeTimeStamp = (timeStamp: string): Date => {
  const time = parseInt(timeStamp, 16);
  return new Date(time);
}

/**
 * Encodes a users birthday using a 36 radix
 */
export const encodeDateOfBirth = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return (date.getTime()).toString(36);
}

/**
 * Decodes a coded birthdate into YYYY/MM/DD format
 */
export const decodeDateOfBirth = (codedDate: string): string => {
  const time = parseInt(codedDate, 36);
  return (new Date(time)).toISOString().split("T")[0].replace(/-/g,'/');
}
