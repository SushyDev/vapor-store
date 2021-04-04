<template>
    <div class="home">
        <p class="display-3 ma-4">Welcome</p>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    created() {
        this.$emit('navType', 0);
    },
});
</script>
