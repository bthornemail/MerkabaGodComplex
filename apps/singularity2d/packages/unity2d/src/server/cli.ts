import CLI from './services/cli.server'
(async () => {
    const cli = new CLI({ identity: "test-user" })
    await cli.start()
})()