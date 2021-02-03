// Constants for Products

export enum ProductCodeType {
  PC_UPC = 'upc',
  PC_EAN = 'ean',
  PC_JAN = 'jan',
  PC_ISBN = 'isbn',
  PC_ISBN13 = 'isbn',
}

export const TypeToField = {
  upc: 'upc',
  ean: 'ean_jan',
  jan: 'ean_jan',
  isbn: 'isbn',
  isbn13: 'isbn13'
}

export const BarcodeLookupKeys =  [ 'mpn', 'model', 'product_name', 'title', 'manufacturer', 'brand', 'label', 'author', 'publisher', 'artist', 'actor', 'director', 'studio', 'genre', 'audience_rating', 'ingredients', 'nutrition_facts', 'color', 'package_quantity', 'size', 'length', 'width', 'height', 'weight', 'release_date', 'description', 'features' ];

export const ProductProperties = [ '_id', 'ysn', 'name', 'title', 'slug', 'description', 'short_description', 'search_tags', 'condition', 'manufacturer', 'brand', 'model', 'label', 'author', 'publisher', 'artist', 'actor', 'director', 'studio', 'genre', 'audience_rating', 'ingredients', 'nutrition_facts', 'color', 'package_quantity', 'size', 'release_date', 'features', 'category_id', 'addl_category_id', 'map', 'weight', 'pkg_dim_height', 'pkg_dim_width', 'pkg_dim_depth', 'mpn', 'upc', 'ean_jan', 'isbn10', 'isbn13', 'sku', 'active', 'taxes', 'other', 'updated_at' ];

/**
 * Barcode Lookup key to Product match.
 */
export const BLKeyToProductMatch = {
  'mpn': 'mpn',
  'model': 'model',
  'product_name': 'name',
  'title': 'title',
  'manufacturer': 'manufacturer',
  'brand': 'brand',
  'label': 'label',
  'author': 'author',
  'publisher': 'publisher',
  'artist': 'artist',
  'actor': 'actor',
  'director': 'director',
  'studio': 'studio',
  'genre': 'genre',
  'audience_rating': 'audience_rating',
  'ingredients': 'ingredients',
  'nutrition_facts': 'nutrition_facts',
  'color': 'color',
  'package_quantity': 'package_quantity',
  'size': 'size',
  'length': 'pkg_dim_depth',
  'width': 'pkg_dim_width',
  'height': 'pkg_dim_height',
  'weight': 'weight',
  'release_date': 'release_date',
  'description': 'description',
  'features': 'features',
}

/**
 * Keys that have special processing requirements.
 */
const BarcodeLookupSpecialKey = [
  'category',
  'format' ,
  'images',
  'stores',
  'reviews'
]

export const RequiredPCVerifyParams = {
  verify: {
    func: (rq: any): boolean => { return !rq.hasOwnProperty('verify') },
    msg: 'Missing operation key, *verify*'
  },
  condition: {
    func: (rq: any): boolean => { return !rq.condition },
    msg: `Missing product condition, *new*, *renewed*, *used*, *opened*`
  },
  type: {
    func: (rq: any): boolean => { return !rq.type },
    msg: 'Missing product code type, *upc*, *ean*, *jan*, *isbn*'
  },
  code: {
    func: (rq: any): boolean => { return !rq.code || isNaN(Number(rq.code)) },
    msg: `Missing product code, or code string contains non-numeric characters.`
  }
};
