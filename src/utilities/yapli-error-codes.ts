export interface ErrorCode {
  code: string;
  error: string;
}

export const YapliErrorCodes = {
  PRODUCT_POST_001: {
    code: 'PP00001',
    error: 'Missing one of the following: UPC, EAN, JAN, ISBN required or apply for product variance.'
  },
  PRODUCT_POST_002: {},
  PORDUCT_GET_001: {
    code: 'PG00001',
    error: 'No YSN or ID passed, please try again.'
  },
  DATABASE_001: {
    code: 'D000001',
    error: 'Error connecting to Database.'
  },
}
