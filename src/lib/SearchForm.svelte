<script lang="ts">
  import { writable } from "svelte/store";
  import { onMount } from "svelte";

  let cityOrZip, timeIndex, timer, low, high, currentTime;

  $: timeIndex;

  const searchStore = writable({});
  const selectedLocation = writable({});
  const locationStore = writable({});

  const toFarenheight = (celcius) => {
    return (celcius * (9 / 5) + 32).toFixed(1) + "°F";
  };

  const findLocationsByNameOrZip = () => {
    selectedLocation.set(null);
    fetch(
      "https://geocoding-api.open-meteo.com/v1/search?name=" +
        encodeURIComponent(cityOrZip)
    )
      .then((response) => response.json())
      .then((data) => {
        searchStore.set(data);
      });
  };

  const setLocation = (item) => {
    localStorage.setItem("savedLocale", JSON.stringify(item));
    searchStore.set(null);
    locationStore.set(item);

    if (item.latitude) {
      let url =
        "https://api.open-meteo.com/v1/forecast?latitude=" +
        item.latitude +
        "&longitude=" +
        item.longitude +
        "&hourly=temperature_2m,apparent_temperature,apparent_temperature,precipitation,weathercode";
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          selectedLocation.set(data);
          updateDataValues();
          timer = setTimeout(() => {
            updateDataValues();
          }, 5 * 60 * 1000); // refresh...
        });
    }

    const updateDataValues = () => {
      const now = new Date();
      now.setMinutes(0);
      now.setSeconds(0);
      const nowStr = now.toISOString().slice(0, 16);
      timeIndex = $selectedLocation.hourly.time.findIndex((d) => d === nowStr);

      const dayTemps = [];
      $selectedLocation.hourly.time.forEach((item, index) => {
        if (item.indexOf(nowStr.slice(0, 10)) === 0) {
          dayTemps.push($selectedLocation.hourly.apparent_temperature[index]);
        }
      });

      currentTime = now.toLocaleString();
      low = Math.min(...dayTemps);
      high = Math.max(...dayTemps);
    };
  };

  const getWeatherCode = (d) => {
    let txt;
    // todo - add weather codes...
    switch (d) {
      case 1:
        txt = "Beautiful";
        break;
      case 2:
        txt = "Thunderstorms";
        break;
      case 3:
        txt = "Cloudy";
        break;
      default:
        txt = "Rain";
    }
    return txt;
  };

  const clearLocation = () => {
    // todo, add a clear button?
    localStorage.setItem("savedLocale", null);
  };

  onMount(() => {
    let storedLocation = localStorage.getItem("savedLocale");
    const parsed = JSON.parse(storedLocation);
    if (parsed) {
      setLocation(parsed);
    }
  });
</script>

<div class="text-center mt-3">
  <div class="inline-block w-full md:w-1/3">
    <form
      class="flex gap-2"
      on:submit|preventDefault={findLocationsByNameOrZip}
    >
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="Enter city or zip..."
        bind:value={cityOrZip}
      />

      <button
        class="bg-blue-500 whitespace-nowrap hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit">Check Weather</button
      >
    </form>
  </div>

  {#if $selectedLocation?.elevation}
    <h1 class="text-2xl mt-3">
      {$locationStore.name},
      {$locationStore.admin1} - {$locationStore.country}
    </h1>

    {#if timeIndex !== null}
      <p class="opacity-50 text-xs mb-3">
        Latitude: {$selectedLocation.latitude}, Longitude: {$selectedLocation.longitude},
        Elevation: {$selectedLocation.elevation}, on {currentTime}
      </p>

      <span class="text-2xl"
        >{toFarenheight(
          $selectedLocation.hourly.apparent_temperature[timeIndex]
        )}
        / {$selectedLocation.hourly.apparent_temperature[
          timeIndex
        ]}{$selectedLocation.hourly_units.apparent_temperature}</span
      ><br />

      {getWeatherCode($selectedLocation.hourly.weathercode[timeIndex])}<br />

      Precipitation: {$selectedLocation.hourly.precipitation[
        timeIndex
      ]}{$selectedLocation.hourly_units.precipitation}<br />

      Day High: {toFarenheight(high)} / {high}{$selectedLocation.hourly_units
        .apparent_temperature}<br />
      Day Low: {toFarenheight(low)} / {low}{$selectedLocation.hourly_units
        .apparent_temperature}<br />
    {/if}
  {:else if $searchStore?.results}
    <p class="mt-3">Choose one:</p>
    <ul>
      {#each $searchStore.results as item (item.id)}
        <li>
          <button
            class="mb-1 w-full block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            on:click={(e) => setLocation(item)}
            >{item.name}, {item.admin1},
            {item.country}</button
          >
        </li>
      {/each}
    </ul>
  {/if}
</div>
