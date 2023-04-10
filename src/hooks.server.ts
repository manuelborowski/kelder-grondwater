import { init as controller_init } from "$lib/server/controller"
import { init as mqtt_init } from "$lib/server/mqtt"
import { init as db_init } from "$lib/server/db"
import { API_KEY } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';

db_init();
mqtt_init();
controller_init();

export const handle = (async ({ event, resolve }) => {
    // console.log(event.url);
    const key = event.url.searchParams.get("key");
    // console.log("key", key)
    if (key !== null && key === API_KEY && event.url.pathname === "/") {
        // console.log("key is valid", key);
        event.cookies.set("access", "true");
        return await resolve(event);
    }

    // console.log("cookie", event.cookies.get("access"));
    if (event.cookies.get("access") === "true") {
        // console.log("cookie is valid", event.cookies.get("access"));
        return await resolve(event);
    }
    // console.log("NO ACCESS")
    return new Response('No access.', {status: 404});
  
  }) satisfies Handle;