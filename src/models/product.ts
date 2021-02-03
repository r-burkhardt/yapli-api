import {Serializable} from '../interfaces/serializable';
import {ObjectID} from 'mongodb';
import {ProductCodeType} from '../constants/product.constants';


/**
 * ProductController Class
 */

export interface ProductValidation {
  valid: boolean;
  message: string;
}

export class Product implements Serializable<Product> {
  public _id?: ObjectID;
  public ysn?: string;
  public name = '';
  public title?: string;
  public slug?: string;
  public description = '';
  public short_description?: string;
  public search_tags = '';
  public condition? = ''; // 'new','refurbished','used','opened'
  public manufacturer?: string;
  public brand = '';
  public model?: string;
  public label?: string;
  public author?: string;
  public publisher?: string;
  public artist?: string;
  public actor?: string;
  public director?: string;
  public studio?: string;
  public genre?: string;
  public audience_rating?: string;
  public ingredients?: string;
  public nutrition_facts?: string;
  public color?: string;
  public package_quantity = 0;
  public size?: string;
  public release_date?: Date;
  public features?: string[];
  public category_id = ''; // '65535';
  public addl_category_id?: string[];  // ['65535'];
  public map?: number;  // Minimum advertised price
  public weight = 0;
  public pkg_dim_height = 0;
  public pkg_dim_width = 0;
  public pkg_dim_depth = 0;
  public mpn?: string;
  public upc?: string;
  public ean_jan?: string;
  public isbn10?: string;
  public isbn13?: string;
  public sku?: string;
  public active?: boolean;
  public taxes?: any[];
  public other?: Record<string, string | number | any[]>;
  public updated_at?: Date;

  constructor (
  ) {}

  serialize(): string {
    return ''
  }

  deserialize(json: object): Product {
    return new Product();
  }

  static validateProductCode(codeType: string, code: string): ProductValidation {
    let validation: ProductValidation;
    switch (codeType) {
      case ProductCodeType.PC_UPC:
        validation = Product.upcValidation(code);
        break;
      case ProductCodeType.PC_EAN:
        validation = Product.eanValidation(code);
        break;
      case ProductCodeType.PC_JAN:
        validation = Product.janValidation(code);
        break;
      case ProductCodeType.PC_ISBN:
        validation = Product.isbnValidation(code);
        break;
      default:
        validation = {
          message: 'Not a valid product code type.',
          valid: false
        };
    }
    return validation;
  }

  private static upcValidation(upc: string): ProductValidation {
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

  private static eanValidation(ean: string): ProductValidation {
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

  private static janValidation(jan: string): ProductValidation {
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

  private static isbnValidation(isbn: string): ProductValidation {
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
    const check = parseInt(code.substring(code.length - 1));
    const noCheck =
        code.substring(0, code.length - 1)
            .split('')
            .map((char) => {
              return parseInt(char);
            })
            .reverse();
    let sumOdd = 0;
    let sumEven = 0;
    for (let i = 0; i < noCheck.length; i++) {
      if (i % 2 === 0) sumOdd += (noCheck[i] * 3);
      else sumEven += noCheck[i];
    }
    const calculated = (sumOdd + sumEven) % 10;

    return ((calculated > 0) ? (10 - calculated) : calculated) === check;
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

  //
}
