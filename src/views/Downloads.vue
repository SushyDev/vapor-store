<template>
    <v-layout class="split d-flex">
        <v-card class="transparent overflow-y-auto rounded-0 flex-grow-1 flex-md-grow-0 surface" width="33%" min-width="500" flat>
            <template v-for="(game, i) in downloads">
                <DownloadItemCard :id="game.id" :key="game.id" :game.sync="downloads[i]"></DownloadItemCard>
            </template>
        </v-card>
        <v-card class="transparent overflow-y-auto flex-grow-1 rounded-0 d-none d-md-block" flat> </v-card>
    </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';

import DownloadItemCard from '@/components/Downloads/DownloadItemCard.vue';
import GameOverview from '@/components/Games/GameOverview.vue';

export default Vue.extend({
    data: () => ({
        downloads: [] as object[],
    }),
    components: {
        GameOverview,
        DownloadItemCard,
    },

    async created() {
        const {getDownloads} = await import('@/downloader');

        getDownloads().forEach((item, i) => {
            Vue.set(this.downloads, i, item);
        });
    },
});
</script>

<style lang="scss" scoped>
.split {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
</style>
