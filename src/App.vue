<template>
    <v-app>
        <v-app-bar color="primary" class="draggable" dark app>
            <v-app-bar-nav-icon @click="drawer = !drawer" class="nondraggable"></v-app-bar-nav-icon>

            <v-toolbar-title class="title mr-6 hidden-sm-and-down select-none">
                {{ $appName || 'Vapor Store' }}
            </v-toolbar-title>

            <component class="nondraggable mx-auto" :slot="NavTypes[NavType].slot" :is="NavTypes[NavType].component"></component>

            <v-app-bar-nav-icon style="visibility: hidden"></v-app-bar-nav-icon>
            <v-toolbar-title class="title mr-6 hidden-sm-and-down" style="visibility: hidden">
                {{ $appName }}
            </v-toolbar-title>

            <div class="nondraggable window-buttons">
                <button class="minimize" @click="Minimize">
                    <svg x="0px" y="0px" viewBox="0 0 10.2 1"><rect x="0" y="50%" width="10.2" height="1" /></svg>
                </button>
                <button class="maximize" @click="Maximize">
                    <svg viewBox="0 0 10 10"><path d="M0,0v10h10V0H0z M9,9H1V1h8V9z" /></svg>
                </button>
                <button class="close" @click="Close">
                    <svg viewBox="0 0 10 10"><polygon points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1" /></svg>
                </button>
            </div>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" app>
            <template v-slot:prepend>
                <div class="px-2 py-3">
                    <v-btn color="secondary" block>
                        Join the Discord
                    </v-btn>
                </div>
            </template>
            <v-list dense nav>
                <v-list-item v-for="item in items" :key="item.title" :to="item.page" link>
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-expand-transition>
                <v-progress-linear v-show="globalLoading" indeterminate query color="secondary"></v-progress-linear>
            </v-expand-transition>
            <router-view @navType="setNav"></router-view>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

const {BrowserWindow} = require('electron').remote;

import SearchBar from '@/components/AppBar/GameSearch.vue';

export default Vue.extend({
    data: () => ({
        globalLoading: false as boolean,
        drawer: false as boolean,
        displaySearch: false as boolean,
        NavType: 0,
        NavTypes: [
            {component: null, slot: null},
            {component: 'SearchBar', slot: null},
        ] as object[],
        items: [
            {title: 'Home', icon: 'mdi-home', page: '/'},
            {title: 'Games', icon: 'mdi-gamepad', page: '/games'},
            {title: 'Installed', icon: 'mdi-library-shelves', page: '/a'},
            {title: 'Downloads', icon: 'mdi-download', page: '/downloads'},
            {title: 'Settings', icon: 'mdi-cog', page: '/settings/'},
        ],
        downloads: [] as object | any,
    }),
    components: {
        SearchBar,
    },
    methods: {
        setNav(type: number) {
            this.NavType = type;
        },
        toggleLoading(show: boolean) {
            this.globalLoading = show;
        },
        getWindow() {
            return BrowserWindow.getFocusedWindow();
        },

        Window() {
            this.getWindow();
        },

        Minimize() {
            this.getWindow().minimize();
        },

        Maximize() {
            this.getWindow().isMaximized() ? this.getWindow().unmaximize() : this.getWindow().maximize();
        },

        Close() {
            this.getWindow().close();
        },
    },
    watch: {
        $route(to, from) {
            if (!(this.$vuetify.breakpoint.xl || this.$vuetify.breakpoint.lg || this.$vuetify.breakpoint.md)) this.drawer = false;
        },
    },
    async created() {
        const {LoadingBus} = await import('@/event-bus');

        LoadingBus.$on('loading', this.toggleLoading);

        const {get} = await import('@/modules/config');

        const config: object | any = get();

        this.$vuetify.theme.dark = config.darkMode;
    },
    async beforeCreate() {
        Vue.prototype.$appName = 'Vapor Store';
        const {initialize} = await import('@/modules/config');
        initialize();
    },
});
</script>

<style lang="scss">
html {
    overflow-y: auto;
}

.focus-highlight:focus-within {
    box-shadow: 0 0 0 3px #ff80ab !important;
}

.hover-highlight:hover {
    box-shadow: 0 0 0 3px #ff80ab !important;
}

.select-none {
    user-select: none;
}

.draggable {
    -webkit-app-region: drag;
}
.cursor-pointer {
    cursor: pointer;
}

.nondraggable {
    -webkit-app-region: no-drag;
}

.scroll-hidden {
    ::-webkit-scrollbar {
        display: none !important;
    }
}

.window-buttons {
    position: fixed;
    top: 0;
    right: 0;

    button {
        width: 46px;
        height: 30px;
        outline: 0;

        svg {
            width: 10px;
            height: 10px;
            stroke: white;
            stroke-width: 0.75;
            fill: #fff;
        }
    }

    button:hover {
        background: rgba(255, 255, 255, 0.1);
    }
}

* {
    ::-webkit-scrollbar {
        width: 10px;
        border: 5px solid white;
        height: 10px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #ff80ab;
    }
    ::-webkit-scrollbar-track {
        background-color: #40c4ff;
    }
    ::-webkit-scrollbar-button:single-button {
        display: none;
    }

    ::selection {
        background-color: #ff80ab;
        color: white;
    }
}
</style>
