<template>
    <v-autocomplete v-model="model" :items="items" :loading="isLoading" :search-input.sync="search" chips clearable hide-details hide-selected flat hide-no-data solo-inverted dark cache-items class="rounded-lg mx-4" item-text="name" item-value="symbol" color="secondary" label="Search for a game...">
        <template v-slot:no-data>
            <v-list-item>
                <v-list-item-title>
                    Search for your favorite
                    <strong>Game</strong>
                </v-list-item-title>
            </v-list-item>
        </template>
        <template v-slot:selection="{attr, on, item, selected}">
            <v-chip v-bind="attr" :input-value="selected" color="secondary" class="white--text" v-on="on">
                <v-icon left>
                    mdi-controller
                </v-icon>
                <span v-text="item.name"></span>
            </v-chip>
        </template>
        <template v-slot:item="{item}">
            <v-list-item-avatar color="secondary" class="headline font-weight-light white--text">
                {{ item.name.charAt(0) }}
            </v-list-item-avatar>
            <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.symbol"></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
                <v-icon>mdi-controller</v-icon>
            </v-list-item-action>
        </template>
    </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'GameSearchBar',
    data: () => ({
        isLoading: false as boolean,
        items: [] as object[],
        model: null as any,
        search: null as any,
        tab: null as any,
    }),

    watch: {
        model(val: any): void {
            if (val != 0) this.tab = 0;
            else this.tab = 0;
        },
        async search(val: any): Promise<void> {
            // Items have already been loaded
            if (this.items.length > 0) return;

            this.isLoading = true;

            // Lazily load input items
            const request: object[] = await fetch('https://api.coingecko.com/api/v3/coins/list').then((response) => response.json());

            this.items = request;

            this.isLoading = false;
        },
    },
});
</script>
