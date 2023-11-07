export class Parameter {
  index: number;
  type: string;
  value: any;

  constructor(index: number, type: string, value: any) {
    this.index = index;
    this.type = type;
    this.value = value;
  }
}
