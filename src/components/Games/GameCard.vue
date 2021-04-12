<template>
    <v-lazy>
        <v-card class="ma-8 rounded-lg hover-highlight focus-highlight" width="375" :disabled="$attrs.loading" @click="$emit('openGame', $attrs.game)">
            <v-img class="white--text align-end" height="250" :src="$attrs.game.metadata.background_image" gradient="0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,.55) 25%, rgba(0,0,0,0) 50%">
                <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                        <span v-bind="attrs" v-on="on" class="title ml-4 select-none text-truncate d-block" style="max-width: 85%">{{ $attrs.game.metadata.name }}</span>
                    </template>
                    <span>{{ $attrs.game.name }}</span>
                </v-tooltip>

                <v-card-actions class="mt-n2">
                    <v-btn color="secondary" @click="[prevent($event), download($attrs.game)]" text>
                        Download
                    </v-btn>

                    <v-btn color="secondary" text>
                        More
                    </v-btn>
                </v-card-actions>
            </v-img>
        </v-card>
    </v-lazy>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    data: () => ({
        selected: false as boolean,
    }),
    methods: {
        // # Prevent opening game overview when clicking the download button
        prevent(e: Event) {
            e.stopPropagation();
        },
        // # Start download of game
        async download(game: object | any) {
            const {download} = await import('@/downloader');
            download(game);
        },
    },
});
</script>
