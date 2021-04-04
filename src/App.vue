<template>
    <v-app>
        <v-app-bar color="primary" class="white--text" app>
            <v-app-bar-nav-icon @click="drawer = !drawer" color="white"></v-app-bar-nav-icon>

            <v-toolbar-title class="title mr-6 hidden-sm-and-down">
                {{ $appName }}
            </v-toolbar-title>

            <component :slot="NavTypes[NavType].slot" :is="NavTypes[NavType].component"></component>
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
                <v-list-item v-for="item in items" :key="item.title" :to="item.page" @click="drawer = !drawer" link>
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
            <router-view @navType="setNav"></router-view>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

import '@/modules/config.ts';

import SearchBar from '@/components/AppBar/GameSearch.vue';
import TabBar from '@/components/AppBar/TabBar.vue';

export default Vue.extend({
    data: () => ({
        drawer: false as boolean,
        displaySearch: false as boolean,
        NavType: 0,
        NavTypes: [
            {component: null, slot: null},
            {component: 'SearchBar', slot: null},
            {component: 'TabBar', slot: 'extension'},
        ] as object[],
        items: [
            {title: 'Home', icon: 'mdi-home', page: '/'},
            {title: 'Games', icon: 'mdi-gamepad', page: '/games'},
            {title: 'Installed', icon: 'mdi-library-shelves', page: '/a'},
            {title: 'Downloads', icon: 'mdi-download', page: '/b'},
            {title: 'Settings', icon: 'mdi-cog', page: '/settings/'},
        ],
    }),
    components: {
        SearchBar,
        TabBar,
    },
    methods: {
        setNav(type: number) {
            this.NavType = type;
        },
    },
    created() {
        Vue.prototype.$appName = 'Vapor Store';
    },
});
</script>

<style lang="scss">
.focus-highlight:focus-within {
    box-shadow: 0 0 0 3px #ff80ab !important;
}

.select-none {
    user-select: none;
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
