export class Page<T> {
  items: T[];
  limit: number;
  offset: number;
  // sec-api stops counting at 10,000 hits, so a larger result reports 10000 here.
  total: number;
}
