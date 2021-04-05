<template>
    <v-row justify="center">
        <v-dialog v-model="$attrs.show" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="$emit('closeGame')">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ $attrs.game ? $attrs.game.name : '' }}</v-toolbar-title>
                </v-toolbar>
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
