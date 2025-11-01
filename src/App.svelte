<script>
  import { filterCsv, csvToJson } from "./helpers/csvParse";

  let file;
  let filtered = "";

  async function handleFile(e) {
    file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    filtered = filterCsv(text);

    const json = csvToJson(filtered);
    console.log(json);
  }
</script>

<div class="p-6 space-y-4 text-center">
  <input
    type="file"
    accept=".csv"
    on:change={handleFile}
    class="p-2 border rounded"
  />
  {#if filtered}
    <p class="text-green-600 font-semibold mt-4">check console</p>
  {/if}
</div>
