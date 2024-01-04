import {get_sensor, get_relay, set_relay} from './mqtt';
import {get_setting} from './db';
import {MA_PERIOD} from "$env/static/private";

let water_level: number = 0;
let relay_state: boolean = false;
let ma_sensor_values: number[] = [];

export const init = () => {
    let state: string = "INIT";
    console.log("starting controller.ts");
    setInterval(() => {
        const sensor_offset = <number>get_setting("sensor_offset");
        const min_level = <number>get_setting("min_level");
        const max_level = <number>get_setting("max_level");
        const raw_sensor_value = get_sensor();

        ma_sensor_values.push(raw_sensor_value);
        if (ma_sensor_values.length >= MA_PERIOD) ma_sensor_values.shift();
        let sensor_value = ma_sensor_values.reduce((sum, i) => sum + i, 0) / ma_sensor_values.length;
        // console.log("average", sensor_value, raw_sensor_value);

        water_level = sensor_offset - sensor_value;

        switch (state) {
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

        // console.log("controller tick STATE, level", state, water_level, min_level);

    }, 1000);
}

export const get_water_level = (): number => {
    return water_level
}

export const get_relay_state = (): boolean => {
    return relay_state
}