/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable new-cap */
/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
import log from '../log';
import Car, { carString } from '../models/cars';
import CarRepository from '../repositories/carRepository';
// import paymentRepository from '../repositories/paymentRepository'; May not need this functiion

class carLotService {
  constructor(
    private repository = CarRepository,
  ) {}

  // methods
  public findById(id: number): Promise<Car | undefined> {
    return this.repository.getById(id);
  }

  public addCar(newCar: Car) {
    this.repository.putCar(newCar);
  }

  public removeCar(removeCar: Car) {
    if(this.findById(removeCar.id)) {
      this.repository.deleteCar(removeCar);
    }
  }

  async addOffer(id: number, offer: [number, string]): Promise<void> {
    const car = await this.repository.getById(id);
    if(car !== undefined) {
      car.offers.push(offer);

      const success = await this.repository.updateCar(car);

      if(!success) {
        // console.log('mission failed');
        log.error(`${offer}`);
        throw new Error('Failed to add offer');
      }
    }
  }

  async removeOffer(id: number, offer: [number, string]): Promise<void> {
    const car = await this.repository.getById(id);
    if(car) {
      car.offers.splice(car.offers.findIndex((offr) => offr[1] === offer[1]), 1);

      const success = await this.repository.updateCar(car);

      if(!success) {
        throw new Error('Failed to remove offer');
      }
    }
  }

  async sellCar(soldCar: Car, offer: number): Promise<void> {
    if(this.findById(soldCar.id)) {
      soldCar.offers = [];
      soldCar.price = offer;

      const success = await this.repository.updateCar(soldCar);

      if(!success) {
        throw new Error('Failed to sell car');
      }
    }
    // this.payments.push([soldCar.id, soldCar.price, (soldCar.price / 48)]);
  }

  async viewLot(): Promise<void> {
    const lot = await this.repository.getAll();
    lot.forEach((car) => { console.log(carString(car)); });
  }
}

export default new carLotService();
