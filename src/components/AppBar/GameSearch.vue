<template>
    <v-responsive class="search" max-width="50vw">
        <v-autocomplete v-model="model" :items="items" :loading="isLoading" :search-input.sync="search" prepend-inner-icon="mdi-magnify" class="rounded-lg" item-text="name" item-value="symbol" color="secondary" label="Search..." clearable hide-details hide-selected flat hide-no-data solo-inverted dark auto-select-first cache-items>
            <template v-slot:item="{item}">
                <v-responsive max-width="fit-content">
                    <v-list-item>
                        <v-list-item-avatar color="secondary" class="headline font-weight-light text-uppercase white--text">
                            {{ item.name.charAt(0) }}
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title class="text-capitalize" v-text="item.name"></v-list-item-title>
                            <v-list-item-subtitle v-text="item.url"></v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-responsive>
            </template>
        </v-autocomplete>
    </v-responsive>
</template>

<script lang="ts">
import Vue from 'vue';

import fs from 'fs';

export default Vue.extend({
    name: 'GameSearchBar',
    data: () => ({
        isLoading: false as boolean,
        items: [] as object[] | any,
        model: null as any,
        search: null as any,
        tab: null as any,
    }),
    methods: {
        // # Open game overview page
        async selectGame(game: object | any) {
            const {GameBus} = await import('@/event-bus');

            const request = await fetch(`https://api.rawg.io/api/games?search=${game.name}`);
            const returned = await request.json();

            game = {...game, metadata: returned.results[0]};

            GameBus.$emit('openGame', game);
        },
    },
    watch: {
        model(val: any, a: any): void {
            if (val != null) this.tab = 0;
            else this.tab = 0;
            const game = this.items.find((item: any) => item.name === val);
            this.selectGame(game);
        },

        // # On search load games list
        async search(): Promise<void> {
            // ? games already loaded
            if (this.items.length > 0) return;
            this.isLoading = true;

            const {get} = await import('@/modules/config');
            const config: {gamesList: File} | any = get();

            const path = await import('path');

            const data = await fs.readFileSync(path.resolve(config?.gamesList?.path), {encoding: 'utf8'});
            const games: object = JSON.parse(data)['list'];
            this.items = games;
            this.isLoading = false;
        },
    },
});
</script>
