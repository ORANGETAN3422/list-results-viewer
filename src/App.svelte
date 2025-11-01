<script>
  import { filterCsv, csvToJson } from "./helpers/csvParse";
  import { sortIntoLevels, sortIntoPeople } from "./helpers/sortResults";

  import LevelDisplay from "./lib/LevelDisplay.svelte";
  import UserDisplay from "./lib/UserDisplay.svelte";

  let file;
  let filtered = "";
  let json;
  let sortedByLevels;
  let sortedByPeople;

  let currentlyViewing = "levels";

  async function handleFile(e) {
    file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    filtered = filterCsv(text);
    //console.log(filtered);

    json = csvToJson(filtered);
    //console.log(json);

    sortedByLevels = sortIntoLevels(json);
    //console.log(sortedByLevels);

    sortedByPeople = sortIntoPeople(json);
    //console.log(sortedByPeople);
  }

  function toggleView() {
    currentlyViewing = currentlyViewing === "people" ? "levels" : "people";
  }
</script>

<div class="p-6 space-y-4 text-center">
  <input
    type="file"
    accept=".csv"
    on:change={handleFile}
    class="p-2 border rounded"
  />
  <br />
  <br />
  {#if filtered}
    <button
      on:click={toggleView}
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      View {currentlyViewing === "people" ? "Levels" : "People"}
    </button>
    {#if currentlyViewing === "levels"}
      <LevelDisplay {sortedByLevels} />
    {:else}
      <UserDisplay {sortedByPeople} />
    {/if}
  {/if}
</div>
