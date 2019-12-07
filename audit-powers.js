
const waivers = ['console', 'console.log', 'console.error', 'console.trace', 'console.warn', 'define'];

async function main(argv, { fsp }) {
  const [config] = argv.slice(2);

  const mix = (a, b) => [a, b].includes('write') ? 'write' : (a || b);
  const data = JSON.parse(await fsp.readFile(config));
  for (const name of Object.keys(data.resources)) {
    const globals = [];
    walk(data.resources, name, detail => {
      for (const [g, a] of Object.entries(detail.globals || {})) {
	if (waivers.includes(g)) { continue; }
	globals[g] = mix(globals[g], a);
      }
    });
    if (Object.keys(globals).length > 0) {
      console.log(name, globals);
    }
  }
}

function walk(resources, name, f) {
  const seen = new Set();
  function recur(n) {
    const detail = resources[n];
    if (!detail) { return; }
    f(detail);
    seen.add(n);
    for (const child of Object.keys(detail.packages || {})) {
      if (!seen.has(child)) {
	recur(child);
      }
    }
  }
  recur(name);
}


/* global require, module, process */
if (require.main == module) {
  // Access ambient stuff only when invoked as main module.
  main(process.argv,
       {
	 fsp: require('fs').promises,
       }
      )
    .catch(oops => console.error(oops));
}
