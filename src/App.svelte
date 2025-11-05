<script>
  import { filterCsv, csvToJson } from "./helpers/csvParse";
  import { sortIntoLevels, sortIntoPeople } from "./helpers/sortResults";
  import Display from "./lib/Display.svelte";

  let file;
  let filtered = "";
  let json;
  let sortedByLevels = {};
  let sortedByPeople = {};

  let currentlyViewing = "people";

  let mainJson = [];
  let extendedJson = [];

  async function handleFile(e, type = "main") {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const filteredCsv = filterCsv(text);
    const parsedJson = csvToJson(filteredCsv);

    if (type === "main") {
      mainJson = [...parsedJson];
    } else if (type === "extended") {
      extendedJson = [...parsedJson];
    }

    e.target.value = "";
  }

  $: combinedJson =
    mainJson.length > 0 && extendedJson.length > 0
      ? [...mainJson, ...extendedJson]
      : [];

  $: if (combinedJson.length > 0) {
    filtered = "combined";
    json = [...combinedJson];

    sortedByLevels = { ...sortIntoLevels(json) };
    sortedByPeople = { ...sortIntoPeople(json) };
  } else {
    filtered = "";
    json = null;
    sortedByLevels = {};
    sortedByPeople = {};
  }

  $: waitingMessage = (() => {
    const waitingFor = [];
    if (mainJson.length === 0) waitingFor.push("Main List CSV");
    if (extendedJson.length === 0) waitingFor.push("Extended List CSV");
    return waitingFor.length > 0
      ? `Waiting for ${waitingFor.join(" and ")}...`
      : "";
  })();

  function toggleView() {
    currentlyViewing = currentlyViewing === "people" ? "levels" : "people";
  }
</script>

<div class="p-6 space-y-4 text-center">
  <!-- Main List Upload -->
  <label class="btn">
    <span>Main List</span>
    <input
      type="file"
      accept=".csv"
      on:change={(e) => handleFile(e, "main")}
      class="hidden"
    />
  </label>

  <!-- Extended List Upload -->
  <label class="btn">
    <span>Extended List</span>
    <input
      type="file"
      accept=".csv"
      on:change={(e) => handleFile(e, "extended")}
      class="hidden"
    />
  </label>

  {#if waitingMessage}
    <p class="waiting-message">{waitingMessage}</p>
  {/if}
  <br /><br />

  {#if filtered === "combined"}
    <button on:click={toggleView} class="btn">
      View {currentlyViewing === "people" ? "Levels" : "People"}
    </button>

    {#if currentlyViewing === "levels"}
      <Display data={sortedByLevels} {currentlyViewing} />
    {:else}
      <Display data={sortedByPeople} {currentlyViewing} />
    {/if}
  {/if}
</div>
