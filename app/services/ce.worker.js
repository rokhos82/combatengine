console.info("Worker started");

onmessage = function(event) {
  console.info(event.data);
};
