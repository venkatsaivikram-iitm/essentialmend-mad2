<script setup>
import { computed } from 'vue';
import LhsBar from './components/LhsBar.vue'; 
import { useRoute, useRouter } from 'vue-router';
import ConfigHolder from './utils/config-holder.js';

const router = useRouter();
const route = useRoute();

const lhsBarNotAllowedPaths = ["/", "/register", "/account-blocked", "/professional-request-pending", "/professional-request-declined", "/professional-service-not-found"];
const showLhsBar = computed(() => !lhsBarNotAllowedPaths.includes(route.path));

if (ConfigHolder.isProfessionalRequestPending) {
    router.push('professional-request-pending');
}
if (ConfigHolder.isProfessionalRequestDeclined) {
    router.push('professional-request-declined');
}
if (ConfigHolder.isProfessionalServiceNotFound) {
    router.push('professional-service-not-found');
}
if (ConfigHolder.isAccountBlocked) {
    router.push('account-blocked');
}
</script>

<template>
    <LhsBar v-if="showLhsBar" />
    <RouterView />
</template>
