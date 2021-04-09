<template>
    <v-card class="hover-highlight focus-highlight mt-12 mb-5 mx-6 rounded">
        <v-sheet v-if="$attrs.game.values" class="v-sheet--offset mx-auto rounded-lg select-none" color="secondary" elevation="12" max-width="calc(100% - 32px)">
            <v-sparkline fill :value="$attrs.game.values" smooth="10" color="white" line-width="2" padding="16"></v-sparkline>
        </v-sheet>

        <v-card-text class="pt-0">
            <div class="title mb-2 text-capitalize select-none" v-text="$attrs.game.name"></div>
            <v-divider class="mb-n4"></v-divider>
        </v-card-text>
        <v-card-actions>
            <v-icon class="ml-4 mr-2" small>
                mdi-download
            </v-icon>
            <span v-if="$attrs.game.progress && $attrs.game.values" class="caption font-weight-light select-none">{{ $attrs.game.progress.toFixed(2) }}% - {{ $attrs.game.values[0].toFixed(2) }}MB/s </span>
            <v-spacer></v-spacer>
            <v-btn color="primary">Cancel</v-btn>
            <v-btn color="primary" class="mr-2">Pause</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'DownloadItemCard',
});
</script>

<style lang="scss" scoped>
.v-sheet--offset {
    top: -24px;
    position: relative;
}
</style>
