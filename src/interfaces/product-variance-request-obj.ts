import { ObjectID } from "mongodb";

export interface ProductVarianceRequestObj {
  _id?: ObjectID;
  seller_id: string;
  status?: string; // open, pending, flagged, flagged-closed, fraud,
  // fraud-closed, closed
  name: string;
  slug?: string;
  short_description: string;
  description: string;
  search_tags: string;
  condition: string; // 'new','renewed','used','opened'
  brand: string;
  category_id: any; // 65535,
  addl_category_id?: any; // 65535,
  currency_id: any; // 1,
  quantity: number;
  price: number;
  weight: number;
  pkg_dim_height: number;
  pkg_dim_width: number;
  pkg_dim_depth: number;
  mpn: string;
  upc_code?: string;
  ean_jan?: string;
  isbn?: string;
  sku?: string;
  stock_level?: number;
  country_id: string;
  active?: boolean;
  taxes?: [];
  updated_at?: Date;
}

export enum ProductVarianceRequestStatuses {
  OPEN = 'open',
  PENDING = 'pending',
  FLAGGED = 'flagged',
  FLAGGED_CLOSED = 'flagged-closed',
  FRAUD = 'fraud',
  FRAUD_CLOSED = 'fraud-closed',
  CLOSED = 'closed'
}

// `id` binary(16) NOT NULL,
//     `v_id` varchar(36) GENERATED ALWAYS AS (BIN_TO_UUID(id)) VIRTUAL,
//     `ysn` varchar(12) NOT NULL,
//     `slug` varchar(255) DEFAULT NULL,
//     `listing_type` enum('auction','product','wanted','reverse','first_bidder','classified') NOT NULL DEFAULT 'product',
//     `name` varchar(255) NOT NULL,
//     `short_description` text DEFAULT NULL,
//     `description` text NOT NULL,
//     `upc_code` varchar(12) DEFAULT NULL,
//     `ean_jan` varchar(13) DEFAULT NULL,
//     `isbn` varchar(13) DEFAULT NULL,
//     `sku` varchar(50) DEFAULT NULL,
//     `search_tags` varchar(255) NOT NULL,
//     `item_condition` enum('new','renewed','used','opened') NOT NULL DEFAULT 'new',
//     `user_id` binary(16) NOT NULL,
//     `v_user_id` varchar(36) GENERATED ALWAYS AS (BIN_TO_UUID(user_id)) VIRTUAL,
//     `list_in` enum('site','store','both') NOT NULL DEFAULT 'site',
//     `category_id` smallint unsigned DEFAULT NULL,
//     `addl_category_id` smallint unsigned DEFAULT NULL,
//     `currency_id` tinyint unsigned DEFAULT NULL,
//     `quantity` int NOT NULL,
//     `shipping_weight` decimal DEFAULT 0,
//     `stock_levels` text DEFAULT NULL,
//     `start_price` decimal(16,2) DEFAULT NULL,
//     `reserve_price` decimal(16,2) DEFAULT NULL,
//     `buyout_price` decimal(16,2) DEFAULT NULL,
//     `enable_make_offer` tinyint DEFAULT NULL,
//     `make_offer_min` decimal(16,2) DEFAULT NULL,
//     `make_offer_max` decimal(16,2) DEFAULT NULL,
//     `apply_tax` tinyint DEFAULT NULL,
//     `bid_increment` decimal(16,2) DEFAULT NULL,
// `start_time` datetime DEFAULT NULL,
// `end_time` datetime DEFAULT NULL,
// `duration` int DEFAULT NULL,
// `hpfeat` tinyint DEFAULT NULL,
// `catfeat` tinyint DEFAULT NULL,
// `bold` tinyint DEFAULT NULL,
// `highlighted` tinyint DEFAULT NULL,
// `private_auction` tinyint DEFAULT NULL,
// `disable_sniping` tinyint DEFAULT NULL,
// `nb_relists` int DEFAULT NULL,
// `auto_relist_sold` tinyint DEFAULT NULL,
// `relist_until_sold` tinyint DEFAULT NULL,
// `is_relisted` tinyint DEFAULT NULL,
// `country_id` smallint unsigned DEFAULT NULL,
// +    `state` varchar(255) DEFAULT NULL,
// +    `address` varchar(255) DEFAULT NULL,
// +    `zip_postcode` varchar(15) NOT NULL,
// `postage_settings` text DEFAULT NULL,
// `offline_payment` text DEFAULT NULL,
// `direct_payment` text DEFAULT NULL,
// `voucher_code` varchar(255) DEFAULT NULL,
// `active` tinyint DEFAULT NULL,
// `approved` tinyint DEFAULT NULL,
// `closed` tinyint DEFAULT NULL,
// `deleted` tinyint DEFAULT NULL,
// `draft` tinyint DEFAULT NULL,
// `nb_clicks` int DEFAULT NULL,
// `rollback_data` text DEFAULT NULL,
// `counted_at` datetime DEFAULT NULL,
// `last_count_operation` enum('none','add','subtract') DEFAULT NULL,
// `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
// `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
