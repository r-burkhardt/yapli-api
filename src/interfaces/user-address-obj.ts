import { ObjectId } from "mongodb";

export interface UserAddressObj {
  _id: ObjectId;
  user_id: ObjectId;
  name: string;
  line_1: string;
  line_2: string;
  line_3: string;
  line_4: string;
  city: string;
  zip_postcode: string;
  state_province_county: string;
  country_id: ObjectId;
  other_address_details: string;
  is_primary: boolean;
  is_billing: boolean;
}
