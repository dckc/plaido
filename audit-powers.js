
const waivers = {
  '__all__': [
    // presumably equivalent to modules
    'define', 

    // provided correctness doesn't depend on output, console.log
    // is a reasonable exception to ocap discipline. There is
    // a forgery risk. console.log output should be marked as
    // such so that users aren't confused.
    'console.log',
    // seems to be used a la `typeof console !== 'undefined'`:
    'console',

    // a little more leeway...
    'console.warn',
  ],

  'util': ['console.error', 'console.trace'],
  'util-deprecate': ['console.trace'],
 
  process: [
    // nextTick() is equivalent to promises, yes? basically?
    'clearInterval', 'setInterval',
    // this is somewhat like clock access, but let's
    // presume it's really just used for nextTick() sorts of thing
    'clearTimeout', 'setTimeout',
  ],
  'timers-browserify': [
    'clearInterval', 'setInterval',
    'clearTimeout', 'setTimeout',
  ],
  'vm-browserify': [
    'document.body.appendChild',
    'document.body.removeChild',
    'document.createElement'
  ],

  'bluebird': [
    'document.createElement',
    'document.createEvent',
    'document.documentElement',
    'navigator', 'cordova',
  ],

  // typo. fixed in 509c1b9
  'ecc-jsbn': [ 'q' ],

  // feature detection really is ambient authority; I'm getting a little far afield here...
  'jsbn': [ 'navigator'],
};


async function main(argv, { fsp }) {
  const [config] = argv.slice(2);

  const mix = (a, b) => [a, b].includes('write') ? 'write' : (a || b);
  const data = JSON.parse(await fsp.readFile(config));
  for (const name of Object.keys(data.resources)) {
    const globals = [];
    walk(data.resources, name, (detail, dep) => {
      const ok = [...(waivers[dep] || []), ...waivers['__all__']];
      for (const [g, a] of Object.entries(detail.globals || {})) {
	if (ok.includes(g)) { continue; }
	console.log(name, 'dep:', dep, 'uses', g);
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
    f(detail, n);
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
