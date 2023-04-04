import { get_sensor, get_relay } from './mqtt';
import { get_setting } from './db';

let water_level: number = 0;
let relay_state: boolean = false;

export const init = () => {
  console.log("starting controller.ts");
  setInterval(() => {
    let sensor_offset = get_setting("sensor_offset");
    let sensor_value = get_sensor();
    water_level = <number>sensor_offset - sensor_value;
    relay_state = get_relay();
    // console.log("controller tick offset, value, level", sensor_offset, sensor_value, water_level);

  }, 1000);
}

export const get_water_level = (): number => {return water_level}

export const get_relay_state = (): boolean => {return relay_state}