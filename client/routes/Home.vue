<script setup>
import ConfigHolder from "../utils/config-holder";

let redirectPath = ConfigHolder.isAuthorized ? '/dashboard' : '/register';
if (ConfigHolder.isProfessionalRequestPending) {
    redirectPath = '/professional-request-declined';
}
if (ConfigHolder.isProfessionalRequestDeclined) {
    redirectPath = '/professional-request-declined';
}
if (ConfigHolder.isProfessionalServiceNotFound) {
    redirectPath = '/professional-service-not-found';
}
if (ConfigHolder.isAccountBlocked) {
    redirectPath = '/account-blocked';
}
</script>

<template>
    <main class="bg-white h-100 w-100 d-flex flex-column align-items-center justify-content-center">
        <h1 class="landing-header d-flex align-items-center gap-4">
            <i class="bi bi-wrench-adjustable-circle"></i>
            <span>EssentialMend</span>
        </h1>
        <h2>Fulfill your <span class="text-danger">NEEDS</span> with just a few <span class="text-info">CLICKS</span> digitally!</h2>
        <RouterLink :to="redirectPath" class="btn btn-dark">Explore Services</RouterLink>
    </main>
</template>