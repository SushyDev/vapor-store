<template>
    <div class="settings">
        <v-container class="my-4">
            <template>
                <v-file-input v-model="gamesList" @change="changes" accept=".json" label="Games List" color="secondary" outlined chips></v-file-input>
            </template>
        </v-container>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';

// @ts-ignore
import {get, setItem} from '@/modules/config.ts';

export default Vue.extend({
    data: () => ({
        gamesList: null as File | null,
    }),
    methods: {
        changes() {
            setItem({
                gamesList: {
                    name: (this.gamesList?.name as string) ?? ('' as string),
                    path: (this.gamesList?.path as string) ?? ('' as string),
                } as object,
            });
        },
    },
    created() {
        this.$emit('navType', 0);

        const gamesList = get().gamesList;
        !gamesList?.name || (this.gamesList = gamesList);
    },
});
</script>
