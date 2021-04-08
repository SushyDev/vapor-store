import Vue from 'vue';
export const GameBus = new Vue();
export const LoadingBus = new Vue();

export const setLoading = (type: boolean) => LoadingBus.$emit('loading', type);


