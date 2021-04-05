<template>
    <v-responsive class="search" max-width="50vw">
        <v-autocomplete v-model="model" :items="items" :loading="isLoading" :search-input.sync="search" prepend-inner-icon="mdi-magnify" class="rounded-lg" item-text="name" item-value="symbol" color="secondary" label="Search..." clearable hide-details hide-selected flat hide-no-data solo-inverted dark cache-items>
            <template v-slot:item="{item}">
                <v-responsive max-width="fit-content" @click="selectGame(item)">
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

// @ts-ignore
import {get} from '@/modules/config';

import {GameBus} from '@/event-bus';

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
        async selectGame(game: object | any) {
            const request = await fetch(`https://api.rawg.io/api/games?search=${game.name}`);
            const returned = await request.json();

            game = {...game, metadata: returned.results[0]};

            GameBus.$emit('openGame', game);
        },
    },
    watch: {
        model(val: string): void {
            if (val != null) this.tab = 0;
            else this.tab = 0;
        },
        search(): void {
            // Items have already been loaded
            if (this.items.length > 0) return;

            this.isLoading = true;

            fs.readFile(get().gamesList.path, 'UTF-8', (err, data) => {
                const games: object = JSON.parse(data)['list'];

                this.items = games;

                this.isLoading = false;
            });
        },
    },
});
</script>
