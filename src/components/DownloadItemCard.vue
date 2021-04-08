clear<template>
    <v-card class="hover-highlight focus-highlight mt-12 mb-5 mx-6 rounded">
        <v-sheet class="v-sheet--offset mx-auto rounded-lg select-none" color="secondary" elevation="12" max-width="calc(100% - 32px)">
            <v-sparkline fill :value="value.length == 0 ? empty : value" smooth="10" color="white" line-width="2" padding="16"></v-sparkline>
        </v-sheet>

        <v-card-text class="pt-0">
            <div class="title mb-2 text-capitalize select-none" v-text="$attrs.game.name"></div>
            <v-divider class="mb-n4"></v-divider>
        </v-card-text>
        <v-card-actions>
            <v-icon class="ml-4 mr-2" small>
                mdi-download
            </v-icon>
            <span class="caption font-weight-light select-none">{{ precent }}% - {{ mbps }}MB/s </span>
            <v-spacer></v-spacer>
            <v-btn color="primary">Cancel</v-btn>
            <v-btn color="primary" class="mr-2">Pause</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

import {DownloaderBus} from '@/downloader/event-bus';

export default Vue.extend({
    name: 'DownloadItemCard',
    data: () => ({
        empty: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as number[],
        value: [] as number[],
        labels: ['MB/s'] as number[] | string[],
        precent: 0 as number,
        mbps: 0 as number,
    }),
    methods: {
        updateProgress(game: object | any) {
            const label: number = game.MBps.toFixed(2);
            const progress: number = game.MBps;

            this.value.push(progress);
            this.labels.push(label);

            if (this.labels.length >= 50) this.labels.splice(1, 1);
            if (this.value.length >= 50) this.value.shift();

            this.precent = game.percent.toFixed(2);
            this.mbps = label;
        },
    },
    created() {
        DownloaderBus.$on(`progress-${this.$attrs.game.metadata.id}`, this.updateProgress);
    },
});
</script>

<style lang="scss" scoped>
.v-sheet--offset {
    top: -24px;
    position: relative;
}
</style>
