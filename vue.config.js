module.exports = {
    transpileDependencies: ['vuetify'],
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            enableRemoteModule: true,
            externals: ['puppeteer', 'electron-dl'],

            builderOptions: {
                appId: 'vapor.store.vue',
                productName: 'Vapor Store Vue',
                asar: true,
                publish: [
                    {
                        provider: 'github',
                        owner: 'SushyDev',
                        repo: 'vapor-store',
                        releaseType: 'prerelease',
                    },
                ],
                nsis: {
                    oneClick: false,
                    perMachine: false,
                    allowToChangeInstallationDirectory: true,
                },
                win: {
                    target: 'nsis',
                },
            },
        },
    },
    devServer: {
        disableHostCheck: true,
        port: '1234',
    },
};
