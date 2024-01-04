import * as mqtt from "async-mqtt"
import {MQTT_SERVER_URL, SONOFF_ID} from '$env/static/private';

let sensor_value: number = 0;
let relay_state: boolean = false;
let client: mqtt.AsyncMqttClient;
let ma_sensor_values: number[] = [];
let average_sensor_value: number = 0;

export const init = () => {
    // console.log(MQTT_SERVER_URL, SONOFF_ID)
    try {
        client = mqtt.connect(MQTT_SERVER_URL);
    } catch (error) {
        console.log("error", error);
    }
    client.on('connect', () => {
        // console.log('connected')
        client.subscribe(`tele/${SONOFF_ID}/SENSOR`)
        client.subscribe(`stat/${SONOFF_ID}/POWER`)
        client.subscribe(`stat/${SONOFF_ID}/STATUS10`)
    })


    client.on('message', (topic, message) => {
        // message is Buffer
        // console.log(topic, message)
        if (topic.toString().includes("SENSOR")) {
            const json_data = JSON.parse(message.toString());
            sensor_value = json_data.SR04.Distance;
            // con:sole.log("sensor value", sensor_value);
        } else if (topic.toString().includes("POWER")) {
            relay_state = message.toString() == "ON";
        } else if (topic.toString().includes("stat")) {
            const json_data = JSON.parse(message.toString());
            sensor_value = json_data.StatusSNS.SR04?.Distance || sensor_value
        }
    })
}

export const get_sensor = () => {
    client.publish(`cmnd/${SONOFF_ID}/STATUS`, "10");
    return sensor_value
}

export const get_relay = () => {
    return relay_state
}

export const set_relay = (state: boolean) => {
    // console.log("set relay", state);
    client.publish(`cmnd/${SONOFF_ID}/POWER`, state ? "ON" : "OFF");
}