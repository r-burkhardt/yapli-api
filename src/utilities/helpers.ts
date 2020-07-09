
export interface QueryInsert {
  [key: string]: string|number
}

export const InsertQueryBuilder = (tableName: string, insertee: QueryInsert, uuidKeys?: string[]): string => {
  const insertKeyString = Object.keys(insertee).join(', ');

  const uuidValues: any[] = [];
  if (uuidKeys) {
    uuidKeys.forEach((key) => {
      uuidValues.push(insertee[key]);
    });
  }

  const insertValueString = Object.values(insertee).map((value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && uuidValues.includes(value)) {
      return `UUID_TO_BIN('${value}')`;
      // return `(UNHEX('${value}'))`;
    }
    return `'${value}'`;
  }).join(', ');

  // return `Insert INTO ${tableName} (${insertKeyString}) VALUES (${insertValueString})`;
  return `Insert INTO ${tableName} (${insertKeyString}) VALUES ?`;
}


