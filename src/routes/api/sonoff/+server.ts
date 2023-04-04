import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { get_water_level, get_relay_state } from '$lib/server/controller';
import { set_relay } from '$lib/server/mqtt';

export const GET = (({ url }) => {
  // console.log("Get sensor")
  return json({water_level: get_water_level(), relay_state: get_relay_state(), status: true})
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
  const data = await request.json();
  if (data.action === "switch_pump_state") {
    const current_state = data.pump_state;
    // console.log("current pump state", current_state);
    set_relay(!current_state);
  }

  // const relay_state = await request.json();
  // console.log(relay_state);
  // set_relay(relay_state);
  return json({status: true})
}) satisfies RequestHandler;
