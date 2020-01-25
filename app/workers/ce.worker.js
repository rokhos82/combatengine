/*
** Simulation worker thread.  This will handle most/all of the actual combat
** simulation for the CombatEngine.
*/
console.info("Simulate Worker started");

var teams = null;

// Import utility scripts
importScripts("https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.js");

// Main message handler
onmessage = function(event) {
  var message = event.data;
  console.info(`Simulate Worker Raw Message: ${message}`);
  if(message.cmd === "init") {
    teams = message.data;
  }
  else if(message.cmd === "status") {}
  else if(message.cmd === "final") {}
  else if(message.cmd === "term") {}
  else {
    console.log(`Simulate Worker Unknown Type ${message.cmd} with Payload ${message.data}`);
  }
};
