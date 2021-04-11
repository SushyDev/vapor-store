<template>
    <div class="games">
        <GameOverview @closeGame="selectedGame = null" :game.sync="selectedGame"></GameOverview>

        <template>
            <v-row justify="center">
                <v-dialog v-model="dialog" persistent max-width="350">
                    <v-card>
                        <v-card-title class="headline">
                            Error loading games list
                        </v-card-title>
                        <v-card-text>You might need to select/reselect the JSON file in the settings</v-card-text>
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
                            <v-slide-item v-for="(game, i) in category.games" :key="game.name">
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

import {GameBus, LoadingBus, setLoading} from '@/event-bus';

export default Vue.extend({
    name: 'Library',
    data: () => ({
        games: [] as object[],
        dialog: false as boolean,
        selectedGame: null as object | null,
        globalLoading: false as boolean,
        loading: false as boolean,
        categories: [] as string[],
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
        toggleLoading(show: boolean) {
            this.globalLoading = show;
        },
        fix() {
            this.$router.push('/settings');
        },
        async loadCategories(categories: any) {
            this.categories = categories;

            categories.forEach((category: any) => {
                category.games = [];
            });

            const {get} = await import('@/modules/config');
            const config: {gamesList: File} | any = get();
            const path = await import('path');

            try {
                const data = await fs.readFileSync(path.resolve(config?.gamesList?.path), {encoding: 'utf8'});
                const games: object = JSON.parse(data)['list'];

                for (let [i, game] of Object.entries(games)) {
                    try {
                        const request = await fetch(`https://api.rawg.io/api/games?search=${game.name}`);
                        const returned = await request.json();
                        game = {...game, metadata: returned.results[0]};

                        const inList = categories.find((category: any) => category.name == game.metadata.genres[0].name);
                        inList.games.push(game);
                    } catch (err) {
                        // ! It is normal for some errors to happen here
                    }
                }
            } catch (err) {
                console.error('Something went wrong loading the games list');
                console.error(err);
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

        LoadingBus.$on('loading', this.toggleLoading);
        GameBus.$on('openGame', this.openGame);

        const request: Response = await fetch('https://api.rawg.io/api/genres');
        const response: any = await request.json();

        this.loadCategories(response.results);
    },
    beforeRouteLeave(to, from, next) {
        // # Switch back to default app bar
        this.$emit('navType', 0);
        setLoading(false);
        next();
    },
});
</script>
