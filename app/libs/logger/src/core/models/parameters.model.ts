export class Parameter {
  name: string;
  type: string;
  value: any;

  constructor(name: string, type: string, value: any) {
    this.name = name;
    this.type = type;
    this.value = value;
  }
}
