/**
 * ProductController Class
 */

export interface ProductValidation {
  valid: boolean;
  message: string;
}

export enum ProductCodes {
  PC_UPC = 'upc',
  PC_EAN = 'ean',
  PC_JAN = 'jan',
  PC_ISBN = 'isbn',
}

export class Product {
  constructor () {}

  static upcValidation(upc: string): ProductValidation {
    const rtrnValidation = {valid: false, message: 'Invalid UPC'};
    if (upc.length !== 12 && upc.length !== 8) {
      rtrnValidation.message = 'UPC is invalid length';
      return rtrnValidation;
    }
    if (!upc.match(/^[0-9]*$/)) {
      rtrnValidation.message = 'UPC is not numeric.';
      return rtrnValidation;
    }
    if (this.verifyModulo10(upc)) {
      rtrnValidation.valid = true;
      rtrnValidation.message = 'Valid UPC';
    }
    return rtrnValidation;
  }

  static eanValidation(ean: string): ProductValidation {
    const rtrnValidation = {valid: false, message: 'Invalid EAN'};
    if (ean.length !== 13 && ean.length !== 8) {
      rtrnValidation.message = 'EAN is invalid length';
      return rtrnValidation;
    }
    if (!ean.match(/^[0-9]*$/)) {
      rtrnValidation.message = 'EAN is not numeric.';
      return rtrnValidation;
    }
    if (this.verifyModulo10(ean)) {
      rtrnValidation.valid = true;
      rtrnValidation.message = 'Valid EAN';
    }
    return rtrnValidation;
  }

  static janValidation(jan: string): ProductValidation {
    const janPrefixes = ['45', '49'];
    const rtrnValidation = {valid: false, message: 'Invalid JAN'};
    if (jan.length !== 13 && jan.length !== 8) {
      rtrnValidation.message = 'JAN is invalid length';
      return rtrnValidation;
    }
    if (!jan.match(/^[0-9]*$/)) {
      rtrnValidation.message = 'JAN is not numeric.';
      return rtrnValidation;
    }
    const prefix = jan.substring(0,2)
    if (!janPrefixes.includes(prefix)) {
      rtrnValidation.message = `${prefix} is not a valid JAN prefix.`;
      return rtrnValidation;
    }
    if (this.verifyModulo10(jan)) {
      rtrnValidation.valid = true;
      rtrnValidation.message = 'Valid JAN';
    }
    return rtrnValidation;
  }

  static isbnValidation(isbn: string): ProductValidation {
    const rtrnValidation = {valid: false, message: 'Invalid ISBN'};
    if (isbn.length !== 13 && isbn.length !== 10) {
      rtrnValidation.message = 'ISBN is invalid length';
      return rtrnValidation;
    }
    if (!isbn.match(/^[0-9]*$/)) {
      rtrnValidation.message = 'ISBN is not numeric.';
      return rtrnValidation;
    }
    if (this.verifyValidIsbn(isbn)) {
      rtrnValidation.valid = true;
      rtrnValidation.message = 'Valid ISBN';
    }
    return rtrnValidation;
  }

  private static verifyModulo10(code: string): boolean {
    const check = code.substring(code.length - 1);
    const noCheck = code.substring(0, code.length - 1);
    let sum = 0;
    (noCheck.split('')).map((char, index) => {
      if (index % 2 === 0) sum += parseInt(char);
      else sum += (parseInt(char) * 3);
    });
    return (10 - (sum % 10)) === parseInt(check);
  }

  private static verifyValidIsbn(code: string): boolean {
    let sum = 0;
    switch (code.length) {
      case 10:
        (code.split('')).map((char, index) => {
          sum += parseInt(char) * (10 - index);
        });
        return sum % 11 === 0;
        break;
      case 13:
        (code.split('')).map((char, index) => {
          if (index % 2 === 0) sum += parseInt(char);
          else sum += (parseInt(char) * 3);
        });
        return sum % 10 === 0;
      default:
        return false;
    }
  }
}
