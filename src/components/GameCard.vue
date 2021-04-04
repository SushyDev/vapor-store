<template>
    <v-card class="ma-8 rounded-lg focus-highlight" max-width="375">
        <v-img class="white--text align-end" height="250" src="https://cdn.vuetifyjs.com/images/cards/docks.jpg">
            <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                    <span v-bind="attrs" v-on="on" class="title ml-4 select-none">Game</span>
                </template>
                <span>fetch-name</span>
            </v-tooltip>

            <v-card-actions class="mt-n2">
                <v-btn color="secondary" text>
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
    name: 'GameCard',
    data: () => ({
        selected: false,
        src: 'https://www.awakenthegreatnesswithin.com/wp-content/uploads/2018/08/Nature-Quotes-1.jpg' as string,
    }),
});
</script>
