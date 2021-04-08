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
            <v-row no-gutters>
                <v-col v-for="(game, i) in games" :key="game.name" class="d-flex justify-center">
                    <GameCard @openGame="openGame" :loading.sync="loading" :game.sync="games[i]"></GameCard>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import fs from 'fs';
import GameCard from '@/components/GameCard.vue';
import GameOverview from '@/components/GameOverview.vue';

// @ts-ignore
import {get} from '@/modules/config.ts';

import {GameBus, LoadingBus, setLoading} from '@/event-bus';

export default Vue.extend({
    name: 'Library',
    data: () => ({
        games: [] as object[],
        dialog: false as boolean,
        selectedGame: null as object | null,
        globalLoading: false as boolean,
        loading: false as boolean,
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
    },
    components: {
        GameCard,
        GameOverview,
    },
    created() {
        setLoading(true);

        LoadingBus.$on('loading', this.toggleLoading);
        GameBus.$on('openGame', this.openGame);

        this.$emit('navType', 1);

        const config: {gamesList: File} = get();

        fs.readFile(config?.gamesList?.path || '', 'UTF-8', async (err, data) => {
            if (err) {
                console.error('Something went wrong loading the games list');
                console.error(err);
                this.dialog = true;
                return;
            }

            const games: object = JSON.parse(data)['list'].slice(0, 10);

            for (let [i, game] of Object.entries(games)) {
                const request = await fetch(`https://api.rawg.io/api/games?search=${game.name}`);
                const returned = await request.json();
                game = {...game, metadata: returned.results[0]};

                this.games.push(game);
            }
            setLoading(false);
        });
    },
    beforeRouteLeave(to, from, next) {
        // # Switch back to default app bar
        this.$emit('navType', 0);
        setLoading(false);
        next();
    },
});
</script>
