export class AutoEntity {
  constructor({ brand, model, state_number, vin_code }) {
    this.brand = brand;
    this.model = model;
    this.state_number = state_number;
    this.vin_code = vin_code;
  }
  id = 0;
  brand: string;
  model: string;
  state_number: string;
  vin_code: string;
}
