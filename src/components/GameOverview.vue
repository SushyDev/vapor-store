<template>
    <v-row justify="center">
        <v-dialog v-model="$attrs.game" persistent fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="$emit('closeGame')">
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
