import {ObjectID} from 'mongodb';

export interface ShippingLocation {
  zip_code: string;
  quantity: number
}

export interface ProductSellerObj {
  _id: ObjectID;
  seller_id: string;
  product_id: string;
  shipping_locations: ShippingLocation[];
  currency_id: any;
  price: number;
  updated_at?: Date;
}
