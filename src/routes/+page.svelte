<script lang="ts">
  // 0.1: added statemachine to control the pump, based on the waterlevel
  // 0.2: added hook to handle api-key
  // 0.3: updated adapter for node
  // 0.4: fetch settings on regular intervals
  // 0.5: introduced moving average for sensor_level

  const version: string = "0.5"
  import CounterInput from "$lib/components/CounterInput.svelte";
  import { onMount } from "svelte";
  

  let current_level: number = 0;
  let min_level: number = 0;
  let max_level: number = 0;
  let sensor_offset: number = 0;
  let pump_state: boolean = false;
  let disable_pump_button = false;

  const get_readings = async () => {
    const response = await fetch('/api/sonoff');
    const data = await response.json();
    current_level = data.water_level;
    pump_state = data.relay_state;
  }

  const get_settings = async () => {
    const response = await fetch('/api/settings?id=["min_level","max_level","sensor_offset"]');
    const data = await response.json();
    ({ min_level, max_level, sensor_offset } = data);
  }

  const update_settings = async () => {
    // console.log("min_level", min_level);
    const respone = await fetch('api/settings',  
      {method: 'POST', body: JSON.stringify({ min_level, max_level, sensor_offset })});
    const status = await respone.json();
    // console.log("status", status)
  }

  const switch_pump_state = async () => {
    // console.log("pump_state", pump_state);
    const respone = await fetch('api/sonoff',  {method: 'POST', body: JSON.stringify({action: "switch_pump_state", pump_state})});
    const status = await respone.json();
    // console.log("status", status)
    disable_pump_button = true;
    setTimeout(() => disable_pump_button = false, 1500);
  }

  onMount(async () => {
    setInterval(get_readings, 1000);
    setInterval(get_settings, 1000);
  })

</script>

<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-4 justify-center">
  <div class="md:flex">
    <div class="md:shrink-0 flex flex-col items-center justify-center space-y-4">
      <div>
        <img class="h-full w-full object-cover md:h-full md:w-48 { pump_state ? 'animate-bounce' : ''}" src="waterpomp.png" alt="Dompelpomp" />
      </div>
      <div>
        <button on:click={switch_pump_state} disabled={disable_pump_button} class="{disable_pump_button ? "bg-red-500" : "bg-blue-500 hover:bg-blue-700" }  text-white font-bold py-2 px-4 rounded">AAN/UIT</button>
      </div>
    </div>
    <div class="p-8">
      <div class="tracking-wide text-sm text-indigo-500 font-semibold border-2 border-indigo-600 rounded-md text-center py-1">Waterniveau: {current_level.toFixed(2)} cm</div>
      <CounterInput bind:count={min_level} on:click={update_settings}>Min hoogte (cm)</CounterInput>
      <CounterInput bind:count={max_level} on:click={update_settings}>Max hoogte (cm)</CounterInput>
      <CounterInput bind:count={sensor_offset} on:click={update_settings}>Hoogte sensor (cm)</CounterInput>
    </div>
  </div>
  <p class="text-center text-xs">@ 2023 MB V{version}</p>
</div>

