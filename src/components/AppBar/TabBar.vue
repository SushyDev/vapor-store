<template v-slot:extension>
    <v-tabs v-model="tab" align-with-title>
        <v-tabs-slider color="secondary"></v-tabs-slider>

        <v-tab v-for="item in items" class="white--text" :key="item.name" :to="item.page">
            {{ item.name }}
        </v-tab>
    </v-tabs>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    data: () => ({
        tab: null,
        items: [
            {name: 'Vapor', page: '/vapor'},
            {name: 'Games', page: '/games'},
        ],
    }),
});
</script>
