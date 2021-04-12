<template>
    <v-snackbar v-model="show">
        {{ text }}

        <template v-slot:action="{attrs}">
            <template v-for="action in actions">
                <v-btn :key="action.text" color="secondary" text v-bind="attrs" @click="action.click">
                    {{ action.text }}
                </v-btn>
            </template>
        </template>
    </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue';

import {SnackBus} from '@/event-bus';


interface action {
    text: string;
    click: Function
}

interface options {
    text: string;
    duration: number;
    actions: action[];
}

export default Vue.extend({
    name: 'Snackbar',
    data: () => ({
        show: false as boolean,
        text: '' as string,
        actions: [] as action[],
    }),

    created() {
        const show = (options: options) => {
            this.show = true;

            this.text = options.text;

            this.actions = options.actions;

            setTimeout(() => (this.show = false), options.duration);
        };

        SnackBus.$on('new', show);
    },
});
</script>
