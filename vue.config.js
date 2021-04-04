module.exports = {
    transpileDependencies: ['vuetify'],
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
    },
    devServer: {
        disableHostCheck: true,
        port: '1234',
    },
};
