<template>
    <div class="settings">
        <v-container class="my-4">
            <template>
                <v-file-input v-model="gamesList" @change="changes" accept=".json" label="Games List" color="secondary" outlined chips></v-file-input>
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
        gamesList: null as File | null,
        dark: true as boolean,
    }),
    methods: {
        changes() {
            setItem({
                gamesList: {
                    name: this.gamesList?.name || '',
                    path: this.gamesList?.path || '',
                } as object,
            });
        },
        toggleTheme() {
            this.dark = !this.dark;
            setItem({darkMode: this.dark});
            this.$vuetify.theme.dark = this.dark;
        },
    },
    created() {
        const config = get();

        console.log(config);

        this.dark = config.darkMode;

        const gamesList = config.gamesList;
        !gamesList?.name || (this.gamesList = gamesList);
    },
});
</script>
