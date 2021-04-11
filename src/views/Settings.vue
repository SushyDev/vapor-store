<template>
    <div class="settings">
        <v-container class="my-4">
            <template>
                <v-file-input v-model="gamesList" @change="setGamesList($event)" accept=".json" label="Games List" color="secondary" outlined chips></v-file-input>
            </template>
            <template>
                <v-file-input @change="setPath($event)" accept="folder" :label="!downloadDir ? 'Downloads folder' : ''" color="secondary" webkitdirectory outlined chips>
                    <template v-slot:selection>
                        <v-chip v-if="false"> </v-chip>
                    </template>
                    <template v-slot:prepend-inner>
                        <v-chip class="mt-n1" v-if="downloadDir">
                            {{ downloadDir }}
                        </v-chip>
                    </template>
                </v-file-input>
            </template>
            <template>
                <v-btn color="secondary" @click="toggleTheme">{{ dark ? 'Light Mode' : 'Dark Mode' }}</v-btn>
            </template>
        </v-container>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';

// @ts-ignore
import {get, setItem} from '@/modules/config.ts';

export default Vue.extend({
    data: () => ({
        downloadDir: null as string | null,
        gamesList: null as File | null,
        dark: true as boolean,
        index: 1,
        text: 'Bruh',
    }),
    methods: {
        setGamesList(event: object | any) {
            setItem({
                gamesList: {
                    name: event.name ?? '',
                    path: event.path ?? '',
                } as object,
            });
        },
        setPath(event: object | any) {
            if (!event.path) return;
            const path = event.path.replace(event.name, '');
            this.downloadDir = path;
            setItem({downloadDir: path as string});
        },
        toggleTheme() {
            this.dark = !this.dark;
            this.$vuetify.theme.dark = this.dark;
            setItem({darkMode: this.dark});
        },
    },
    created() {
        const config: object | any = get();
        this.dark = config.darkMode;

        const gamesList = config.gamesList;
        const downloadDir = config.downloadDir;
        !gamesList?.name || (this.gamesList = gamesList);
        !downloadDir || (this.downloadDir = downloadDir);
    },
});
</script>
