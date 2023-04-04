import { get_sensor, get_relay, set_relay } from './mqtt';
import { get_setting } from './db';

let water_level: number = 0;
let relay_state: boolean = false;

export const init = () => {
  let state: string = "INIT";
  console.log("starting controller.ts");
  setInterval(() => {
    const sensor_offset = <number>get_setting("sensor_offset");
    const min_level = <number>get_setting("min_level");
    const max_level = <number>get_setting("max_level");
    const sensor_value = get_sensor();
    water_level = sensor_offset - sensor_value;

    switch(state) {
      case "INIT":
        if (water_level < max_level) {
          state = "OFF";
          set_relay(false);
        } else {
          state = "ON";
          set_relay(true);
        }
        break;
      case "ON":
        if (water_level < min_level) {
          state = "OFF";
          set_relay(false);
        }
        break;
      case "OFF":
        if (water_level > max_level) {
          state = "ON";
          set_relay(true);
        }
        break;
    }
    relay_state = get_relay();

    // console.log("controller tick STATE, level", state, water_level);

  }, 1000);
}

export const get_water_level = (): number => {return water_level}

export const get_relay_state = (): boolean => {return relay_state}