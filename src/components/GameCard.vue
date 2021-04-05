<template>
    <v-card class="ma-8 rounded-lg hover-highlight focus-highlight" max-width="375">
        <v-img class="white--text align-end" height="250" :src="$attrs.game.metadata.background_image" gradient="0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,.55) 25%, rgba(0,0,0,0) 50%">
            <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                    <span v-bind="attrs" v-on="on" class="title ml-4 select-none">{{ $attrs.game.metadata.name }}</span>
                </template>
                <span>{{ $attrs.game.name }}</span>
            </v-tooltip>

            <v-card-actions class="mt-n2">
                <v-btn color="secondary" @click="$emit('openGame', $attrs.game)" text>
                    Download
                </v-btn>

                <v-btn color="secondary" text>
                    More
                </v-btn>
            </v-card-actions>
        </v-img>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    data: () => ({
        selected: false as boolean,
    }),
});
</script>
