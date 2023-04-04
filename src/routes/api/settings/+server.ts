import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { get_setting, get_setting_all, set_setting } from '$lib/server/db';

export const GET = (async ({ url }) => {
  let settings: {[key: string]: string|number|boolean} = {};
  // console.log(url.searchParams.get("id")  || "[]");
  const ids = JSON.parse(url.searchParams.get("id")  || "[]");
  if (ids.length > 0) {
    ids.forEach((name: string) => {
      const value = get_setting(name);
      // console.log("setting", name, value);
      settings[name] = value;
    });
  } else {
    const all_settings = get_setting_all();
    all_settings.forEach(setting => {
      settings[setting.name] = setting.value;
    })
  }
  // console.log("settings", settings);
  return json(settings);
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
  const settings = await request.json();
  for (const [key, value ] of Object.entries(settings)) {
    set_setting(key, <string | number | boolean>value);
    // console.log(`${key}: ${value}`);
  }
  return json({status: true})
}) satisfies RequestHandler;


