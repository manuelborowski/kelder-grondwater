import { Collection, connect } from 'json-file-database'

type StringSetting = { name: string, value: string }
type NumberSetting = { name: string, value: number }
type BooleanSetting = { name: string, value: boolean }

let db_settings: Collection<StringSetting | NumberSetting | BooleanSetting>;

export const init = () => {
  const db = connect({
    file: "./db.json",
    init: {
      settings: [
        { name: "min_level", value: 12 },
        { name: "max_level", value: 25 },
        { name: "sensor_offset", value: 30 },
      ]
    }
  });
  db_settings = db<StringSetting | NumberSetting | BooleanSetting>({ name: "settings", primaryKey: "name" });
}

export const get_setting = (name: string): string | number | boolean => {
  let db_setting = db_settings.find({ name })
  // console.log("get_setting", name, db_setting);
  return db_setting?.value || false
}

export const get_setting_all = (): readonly (StringSetting | NumberSetting | BooleanSetting)[] => {
  let all_settings = db_settings.findAll(() => true);
  return all_settings;
}

export const set_setting = (name: string, value: string | number | boolean): boolean => {
  const ret = db_settings.update({ name, value });
  // console.log("set_setting, ret,", ret)
  return ret;
}

