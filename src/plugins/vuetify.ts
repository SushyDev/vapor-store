import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: colors.lightBlue.accent2,
                secondary: colors.pink.accent1,
            },
            light: {
                primary: colors.lightBlue.accent2,
                secondary: colors.pink.accent1,
            },
        },
    },
});
