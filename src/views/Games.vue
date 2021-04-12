<template>
    <div class="games">
        <GameOverview @closeGame="selectedGame = null" :game.sync="selectedGame"></GameOverview>

        <template>
            <v-row justify="center">
                <v-dialog v-model="dialog" persistent max-width="350">
                    <v-card>
                        <v-card-title class="headline" v-text="errorTitle"> </v-card-title>
                        <v-card-text v-text="error"></v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="red darken-1" text @click="fix">
                                Fix
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>

        <v-container fluid>
            <v-row no-gutters v-for="category in categories" :key="category.id">
                <v-expand-transition>
                    <v-container v-if="category.games.length !== 0" class="mt-8" fluid>
                        <h1 v-text="category.name"></h1>
                        <v-slide-group show-arrows>
                            <v-slide-item v-for="(game, i) in category.games" :key="game.metadata.id">
                                <GameCard @openGame="openGame" :loading.sync="loading" :game.sync="category.games[i]"></GameCard>
                            </v-slide-item>
                        </v-slide-group>
                    </v-container>
                </v-expand-transition>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import fs from 'fs';
import GameCard from '@/components/Games/GameCard.vue';
import GameOverview from '@/components/Games/GameOverview.vue';

import {GameBus, setLoading} from '@/event-bus';

export default Vue.extend({
    name: 'Library',
    data: () => ({
        dialog: false as boolean,
        selectedGame: null as object | null,
        loading: false as boolean,
        categories: [] as string[],
        errorTitle: '' as string,
        error: '' as string,
        worker: null as Worker | null,
    }),
    methods: {
        async openGame(game: object | any) {
            setLoading(true);
            this.loading = true;

            const request = await fetch(`https://api.rawg.io/api/games/${game.metadata.id}`);
            game.metadata = await request.json();

            const screenshots = await fetch(`https://api.rawg.io/api/games/${game.metadata.id}/screenshots`);
            const ssList = await screenshots.json();
            game.metadata.screenshots = ssList.results;

            this.selectedGame = game;
            this.loading = false;
            setLoading(false);
        },
        fix() {
            this.$router.push('/settings');
        },
        async loadCategories(categories: any) {
            this.categories = categories;

            // ? Empty listed games to fill with own list
            categories.forEach((category: any) => (category.games = []));

            const {get} = await import('@/modules/config');
            const config: {gamesList: File} | any = get();
            const path = await import('path');

            if (config.downloadDir === '') {
                this.errorTitle = "You haven't selected a download folder yet";
                this.error = 'Please select one in the settings';
                this.dialog = true;
            }

            try {
                const data = await fs.readFileSync(path.resolve(config?.gamesList?.path), {encoding: 'utf8'});
                const games: object = JSON.parse(data)['list'];

                this.worker!.onmessage = (event) => {
                    try {
                        const game = JSON.parse(event.data);
                        const list = categories.find((category: any) => category.name == game.metadata.genres[0].name);
                        list.games.push(game);
                    } catch (e) {}
                };

                this.worker!.postMessage({games, categories});
            } catch (err) {
                console.error(err);
                this.errorTitle = 'Error loading games list';
                this.error = 'You might need to select/reselect the JSON file in the settings';
                this.dialog = true;
                return;
            }

            setLoading(false);
        },
    },
    components: {
        GameCard,
        GameOverview,
    },
    async created() {
        this.$emit('navType', 1);

        GameBus.$on('openGame', this.openGame);

        const request: Response = await fetch('https://api.rawg.io/api/genres');
        const response: any = await request.json();

        this.loadCategories(response.results);

        // ? Setup new worker
        this.worker = new Worker('@/workers/categories.worker', {type: 'module'});
    },
    beforeRouteLeave(to, from, next) {
        // ? Switch back to default app bar
        this.$emit('navType', 0);
        // ? Terminate webworker
        this.worker!.terminate();
        setLoading(false);
        next();
    },
});
</script>
