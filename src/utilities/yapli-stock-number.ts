import {MongoDatabase} from './mongo-database';
import * as fs from 'fs';
import * as path from 'path';
import lockfile = require('proper-lockfile');


/**
 * Yapli Stock Number(YSN)
 * YSN is a customized stock/product number that contains 10-12 characters
 * for tracking listed products sold through Yapli.com.
 *
 * The number is based on 9 characters with a base36(0-9 and A-Z[all caps])
 * incrementing up from 0 to Z and 1-3 characters in the base26(Z-A[all
 * caps]) incrementing down from Z to A. The number works from left to
 * right, so that when column 0 reaches Z, the next number will place a 1 in
 * column 1 and set column 0 to 0. This is the incrementing process for
 * columns 0-8, columns 9-11* will start at Z and increment towards A.
 * Column 10 and 11 are added only in the event that 9 or 10 has reached A
 * and would need to set back to Z, therefore adding the next coumn to the
 * right to handle incremental increase from the column before.
 *
 * The design of this number as the following limitations based on the how
 * many base26 numbers are included:
 *     2 640 558 873 378 816 Quadrillion  36*36*36*36*36*36*36*36*36*26
 *    68 654 530 707 849 216              36*36*36*36*36*36*36*36*36*26*26
 * 1 785 017 798 404 079 616 Quintillion  36*36*36*36*36*36*36*36*36*26*26*26
 */

interface YSNObject {
  ysn: string;
}

export class YapliStockNumber {
  // private db = new MongoDatabase();
  // TODO() Find a relative path to ysn-last-number.json
  private pathToLastYSN = `../yapli-data/ysn-last-number.json`
  // private pathToLastYSN = `/Users/rnagashima/Google Drive/coding-programming/yapli/data/ysn-last-number.json`;
  //   path.join(__dirname, 'data', 'ysn-last-number.json');
  private retryOptions = {
    retries: {
      retries: 5,
      factor: 3,
      minTimeout: 1 * 1000,
      maxTimeout: 60 * 1000,
      randomize: true,
    }
  };

  /**
   * Processes the request for new Yapli Stock Numbers and returns the
   * number/numbers in the the form of a string array. There is an optional
   * parameters for a quanity of YSNs being requested, should no number be
   * passed as a parameter it will default to 1. This is an async function
   * as it has to read data from and external file that contains the last
   * created YSN for which the function will base all new YSNs on for this
   * call. To prevent the there being duplications of the YSN number, the
   * ysn-last-number.json file is locked while each request for YSNs is
   * being processed.
   * @param {number} amountRequested
   * @returns {Promise<string[]>}
   */
  async getYapliStockNumbers(amountRequested: number = 1): Promise<string[]> {
    const returnYSNs: string [] = [];
    let lastYSN: YSNObject = {
      ysn: '',
    };

    await lockfile.lock(this.pathToLastYSN)
        .then(async (release) => {
          const readData = fs.readFileSync(this.pathToLastYSN);
          lastYSN = JSON.parse(readData.toString());
          const startYSN = JSON.parse(readData.toString());

          for (let i = 0; i < amountRequested; i++) {
            const newYSN = this.generateNextYSN(lastYSN.ysn);
            lastYSN.ysn = newYSN;
            returnYSNs.push(newYSN);
          }

          let data = JSON.stringify(lastYSN, null, 2);

          // update file with the last new YSN generated
          fs.writeFile(this.pathToLastYSN, data, (err) => {
            if (err) throw err;
          });

          // Call the provided release function when you're done,
          // which will also return a promise
          await lockfile.unlock(this.pathToLastYSN);
        })
        .catch((e) => {
          // either lock could not be acquired or releasing it failed
          console.error('E', e)
        });
    return returnYSNs;
  }

  /**
   * Yapli Stock Number Generator
   *
   * Takes in a YSN and, increments and return the next YSN.
   *
   * @param {string} lastId
   * @param {number} nextIndex
   * @returns {string}
   */
  private generateNextYSN = (lastId: string, nextIndex: number = 1): string => {
    const CHAR_36 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const CHAR_26 = CHAR_36.slice(10).reverse();
    const id = lastId.split('');
    let index = 0;
    let carryOver = nextIndex;

    do {
      if (index < 9) {
        const char36Val = CHAR_36.findIndex(char => char === id[index]);
        if (char36Val + carryOver > 35) {
          id[index] = CHAR_36[char36Val + carryOver - 36];
          carryOver = 1;
        } else {
          id[index] = CHAR_36[char36Val + carryOver];
          carryOver = 0;
        }
      } else {
        const char26Val = CHAR_26.findIndex(char => char === id[index]);
        if (carryOver > 0) {
          if (char26Val + carryOver > 25) {
            id[index] = CHAR_26[char26Val + carryOver - 26];
          } else {
            id[index] = CHAR_26[char26Val + carryOver];
          }
        }
      }
      index++;
    } while (carryOver > 0 && index <= id.length - 1);
    return id.join('');
  };

  /**
   * Compares 2 YSNs and returns:
   *   -1 if ysn1 is larger than ysn2
   *   1 if ysn2 is larger than ysn1
   *   0 if they are the equal
   * Used for comparing ysn numbers only.
   * @param {string} a
   * @param {string} b
   * @returns {number}
   */
  compare(a: YSNObject, b: YSNObject): number {
    if (a.ysn.substring(0,8) > b.ysn.substring(0,8) &&
        b.ysn.substring(9) >= a.ysn.substring(9)) {
      return -1;
    }
    if (b.ysn.substring(0,8) > a.ysn.substring(0,8) &&
        a.ysn.substring(9) >= b.ysn.substring(9)) {
      return 1;
    }
    return 0
  }
}
