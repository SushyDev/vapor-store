<template>
    <v-card v-show="!$attrs.game.removed[0]" class="hover-highlight focus-highlight mt-12 mb-5 mx-6 rounded">
        <v-sheet class="v-sheet--offset mx-auto rounded-lg select-none" color="secondary" elevation="12" max-width="calc(100% - 32px)">
            <v-sparkline fill v-if="$attrs.game.values.length !== 1" :value="$attrs.game.values" smooth="10" color="white" line-width="2" padding="16"></v-sparkline>
            <p v-else class="py-6 text-center display-2">Fetching</p>
        </v-sheet>

        <v-card-text class="pt-0">
            <div class="title mb-2 text-capitalize select-none" v-text="$attrs.game.name"></div>
            <v-divider class="mb-n4"></v-divider>
        </v-card-text>

        <v-card-actions>
            <v-icon class="ml-4 mr-2" small>
                mdi-download
            </v-icon>
            <span v-if="$attrs.game.values.length !== 1" class="caption font-weight-light select-none">{{ $attrs.game.progress[0].toFixed(2) }}% - {{ $attrs.game.values[0].toFixed(2) }}MB/s</span>
            <span v-else class="caption font-weight-light select-none">Fetching...</span>

            <v-spacer></v-spacer>
            <v-btn v-if="$attrs.game.values.length !== 1" color="primary" @click="cancel($attrs.game)">Cancel</v-btn>
            <v-btn v-if="$attrs.game.values.length !== 1" color="primary" class="mr-2" @click="pause($attrs.game)">Pause</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'DownloadItemCard',
    methods: {
        // # Cancel download
        async cancel(game: object | any) {
            const {cancel} = await import('@/downloader');
            cancel(game);
        },

        // # Pause/Continue download
        async pause(game: object | any) {
            const {pause} = await import('@/downloader');
            pause(game);
        },
    },
});
</script>

<style lang="scss" scoped>
.v-sheet--offset {
    top: -24px;
    position: relative;
}
</style>
