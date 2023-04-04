import { init as controller_init } from "$lib/server/controller"
import { init as mqtt_init } from "$lib/server/mqtt"
import { init as db_init } from "$lib/server/db"

db_init();
mqtt_init();
controller_init();