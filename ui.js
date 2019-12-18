// const plaidClient = new plaid.Client(client_id, secret, public_key, plaid_env, {version: '2018-05-22'});
/* global exports */

// ISSUE: does FormData get all its authority from the form argument? or does it have some of its own?
/* global FormData */
module.exports = Object.freeze({ startUI });

function startUI({ getForm, store }) {
  const form = getForm('config');

  load();
  form.addEventListener('submit', save);

  function load() {
    const data = new FormData(form);
    for (const k of data.keys()) {
      form.elements[k].value = store.getItem(k);
    }
  }

  function save(event) {
    const data = new FormData(form);
    for (const k of data.keys()) {
      store.setItem(k, data.get(k));
    }
    event.preventDefault();
  }
}
