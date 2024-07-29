import nano from "nano";

export interface Order extends nano.MangoResponse<unknown> {
  _id: string;
  _rev: string;
  id: string;
  type: string;
  user_id: string;
  products: [{ id: string; name: string; price: number; quantity: number }];
  date: Date;
  status: string;
  total_price: number;
  table_id: string;
  venue_id: string;
}
