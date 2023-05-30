module.exports = {
  apps : [{
    script    : "./dist/src/server.js",
    instances : "max",
    exec_mode : "cluster"
  }]
}
