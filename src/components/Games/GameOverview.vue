<template>
    <v-row justify="center">
        <v-dialog v-model="$attrs.game" persistent fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark color="primary" class="draggable">
                    <v-btn icon dark class="nondraggable" @click="$emit('closeGame')">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title v-if="$attrs.game" v-text="$attrs.game.metadata.name"></v-toolbar-title>
                </v-toolbar>
                <v-container fluid>
                    <v-row no-gutters class="mb-4">
                        <v-col cols="12" class="d-flex flex-column flex-md-row">
                            <v-card light height="600" width="360" class="rounded-lg">
                                <v-img height="100%" width="100%" v-if="$attrs.game" :src="$attrs.game.metadata.background_image"></v-img>
                            </v-card>

                            <v-card class="mx-4 my-2 d-flex flex-column" flat>
                                <p class="display-1" v-if="$attrs.game" v-text="$attrs.game.metadata.name"></p>
                                <v-responsive max-height="525" class="overflow-y-auto">
                                    <p class="mr-2" v-if="$attrs.game" v-html="$attrs.game.metadata.description"></p>
                                </v-responsive>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col cols="12">
                            <template>
                                <v-slide-group v-if="$attrs.game" multiple show-arrows>
                                    <v-slide-item v-for="(n, i) in $attrs.game.metadata.screenshots" :key="i">
                                        <v-img :src="$attrs.game.metadata.screenshots[i].image" class="ma-4" width="500" contain />
                                    </v-slide-item>
                                </v-slide-group>
                            </template>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="mt-8" v-if="$attrs.game">
                        <template v-if="$attrs.game.metadata.esrb_rating">
                            <v-col class="align-center d-flex flex-column">
                                <p class="headline">Age Rating</p>
                                <p class="subtitle-1">{{ $attrs.game.metadata.esrb_rating.name }}</p>
                            </v-col>
                        </template>

                        <template v-if="$attrs.game.metadata.released">
                            <v-col class="align-center d-flex flex-column">
                                <p class="headline">Released</p>
                                <p class="subtitle-1">{{ $attrs.game.metadata.released }}</p>
                            </v-col>
                        </template>

                        <!--Publishers-->
                        <template v-if="$attrs.game.metadata.publishers">
                            <v-col class="align-center d-flex flex-column">
                                <p class="headline">Publisher</p>
                                <template v-for="publisher in $attrs.game.metadata.publishers">
                                    <p :key="publisher.name" class="subtitle-1">{{ publisher.name }}</p>
                                </template>
                            </v-col>
                        </template>

                        <template v-if="$attrs.game.metadata.developers">
                            <v-col class="align-center d-flex flex-column">
                                <p class="headline">Developers</p>
                                <template v-for="developer in $attrs.game.metadata.developers">
                                    <p :key="developer.name" class="subtitle-1">{{ developer.name }}</p>
                                </template>
                            </v-col>
                        </template>

                        <template v-if="$attrs.game.metadata.platforms">
                            <v-col class="align-center d-flex flex-column">
                                <p class="headline">Platforms</p>
                                <template v-for="platform in $attrs.game.metadata.platforms">
                                    <p :key="platform.platform.name" class="subtitle-1">{{ platform.platform.name }}</p>
                                </template>
                            </v-col>
                        </template>

                        <template v-if="$attrs.game.metadata.genres">
                            <v-col class="align-center d-flex flex-column">
                                <p class="headline">Genres</p>
                                <template v-for="genre in $attrs.game.metadata.genres">
                                    <p :key="genre.nane" class="subtitle-1">{{ genre.name }}</p>
                                </template>
                            </v-col>
                        </template>
                    </v-row>
                </v-container>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'GameOverview',
});
</script>
