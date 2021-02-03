import {Serializable} from '../interfaces/serializable';
import {ObjectID} from 'mongodb'
import {ShippingLocation} from '../interfaces/shipping location';


class ProductSeller implements Serializable<ProductSeller> {
  _id?: ObjectID;
  product_id = '';
  seller_id = '';
  shipping_locations: ShippingLocation[] = [];
  currency_id = '';
  price = 0;
  updated_at?: Date;

  constructor () {}

  serialize (): string {
    return ''
  }

  deserialize (json: object): ProductSeller {
    return new ProductSeller();
  }
}
