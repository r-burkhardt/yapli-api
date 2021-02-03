export interface Serializable<T> {
  serialize(): string;
  deserialize(json: object): T;
  clone?(): T;
}
