<template>
    <v-container fluid>
        <v-row no-gutters>
            <v-col v-for="n in 30" :key="n" class="d-flex justify-center">
                <GameCard></GameCard>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

import GameCard from '@/components/GameCard.vue';

export default Vue.extend({
    name: 'Library' as string,
    data: () => ({}),
    components: {
        GameCard,
    },
    created() {
        this.$emit('navType', 1);
    },
});
</script>
