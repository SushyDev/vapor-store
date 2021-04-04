<template>
    <div class="settings">
        <v-container>
            <template>
                <v-file-input v-model="gamesList" @change="changes" accept=".json" label="Games List" outlined chips></v-file-input>
            </template>
        </v-container>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    data: () => ({
        gamesList: {
            name: 'Games.json',
        } as File,
    }),
    methods: {
        changes() {
            console.log(this.gamesList);
        },
    },
    created() {
        this.$emit('navType', 2);
    },
});
</script>
