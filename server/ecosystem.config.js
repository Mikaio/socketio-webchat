module.exports = {
    apps: [
        {
            name: "main",
            script: "./dist/src/server.js",
            instances: "max",
            exec_mode: "cluster",
            args: "mode=cluster",
        },
        {
            name: "queue",
            script: "dist/src/services/queue.js",
        },
    ]
}
