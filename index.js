// ISSUE: I'd rather do this bootstrap in index.html
/* global require */
/* global document, localStorage */
const UI = require('./ui');

UI.startUI({
  getForm: id => document.getElementById(id),
  store: localStorage,
});
