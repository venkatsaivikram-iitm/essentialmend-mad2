<script setup>
import { useAppStore } from "../stores/app-store.js";
import { useRouter } from 'vue-router'
import ConfigHolder from "../utils/config-holder.js";

const appStore = useAppStore();
const router = useRouter();

const path = window.location.pathname;
if (appStore.availableRoutes.includes(path)) {
    appStore.module = path.slice(1);
} else if (!appStore.availableRoutes.includes(path) && appStore.config.authorized) {
    router.push("dashboard");
    appStore.module = "dashboard";
} else {
    router.push("/");
    appStore.module = "";
}

const changeModule = (event) => {
    appStore.module = event.target.dataset.module;
    router.push(appStore.module);
}
</script>

<template>
    <section id="lhs-bar" class="p-2 h-100 rounded-end bg-white overflow-scroll">
        <aside class="d-flex flex-column justify-content-between h-100">
            <section class="d-flex flex-column gap-2">
                <div class="d-flex gap-2 justify-content-center align-items-center text-decoration-none p-1 rounded bg-black text-white">
                    <i class="bi bi-wrench-adjustable-circle"></i>
                    <h1 class="h4 m-0 p-0">EssentialMend</h1>
                </div>
                <div class="mt-2 line-separator"></div>
                <button
                    title="Dashboard"
                    data-module="dashboard"
                    data-app="em"
                    class="w-100 d-flex gap-2 align-items-center p-1 rounded" 
                    :class="{
                        'text-white': appStore.module === 'dashboard',
                        'bg-black': appStore.module === 'dashboard'
                    }"
                    @click="changeModule"
                >
                    <i class="bi bi-house-door-fill" data-module="dashboard"></i>
                    <h2 class="h5 m-0 p-0" data-module="dashboard">Dashboard</h2>
                </button>
                <button
                    v-if="ConfigHolder.isUser"
                    title="Services"
                    data-module="services"
                    data-app="em"
                    class="w-100 d-flex gap-2 align-items-center p-1 rounded" 
                    :class="{
                        'text-white': appStore.module === 'services',
                        'bg-black': appStore.module === 'services'
                    }"
                    @click="changeModule"
                >
                    <i class="bi bi-hammer" data-module="services"></i>
                    <h2 class="h5 m-0 p-0" data-module="services">Services</h2>
                </button>
                <button
                    title="Service Requests"
                    data-module="servicerequests"
                    data-app="em"
                    class="w-100 d-flex gap-2 align-items-center p-1 rounded" 
                    :class="{
                        'text-white': appStore.module === 'servicerequests',
                        'bg-black': appStore.module === 'servicerequests'
                    }"
                    @click="changeModule"
                >
                    <i class="bi bi-tools" data-module="servicerequests"></i>
                    <h2 class="h5 m-0 p-0" data-module="servicerequests">Service Requests</h2>
                </button>
                <button
                    title="Reviews"
                    data-module="reviews"
                    data-app="em"
                    class="w-100 d-flex gap-2 align-items-center p-1 rounded" 
                    :class="{
                        'text-white': appStore.module === 'reviews',
                        'bg-black': appStore.module === 'reviews'
                    }"
                    @click="changeModule"
                >
                    <i class="bi bi-chat-square-text-fill" data-module="reviews"></i>
                    <h2 class="h5 m-0 p-0" data-module="reviews">Reviews</h2>
                </button>
                <button
                    v-if="ConfigHolder.isAdmin"
                    title="Admin Panel"
                    data-module="adminpanel"
                    data-app="em"
                    class="w-100 d-flex gap-2 align-items-center p-1 rounded" 
                    :class="{
                        'text-white': appStore.module === 'adminpanel',
                        'bg-black': appStore.module === 'adminpanel'
                    }"
                    @click="changeModule"
                >
                    <i class="bi bi-person-workspace" data-module="adminpanel"></i>
                    <h2 class="h5 m-0 p-0" data-module="adminpanel">Admin Panel</h2>
                </button>
            </section>
            <section class="d-flex flex-column align-items-center gap-1">
                <button
                    title="Account"
                    data-module="account"
                    data-app="em"
                    class="w-100 d-flex gap-2 align-items-center p-1 rounded" 
                    :class="{
                        'text-white': appStore.module === 'account',
                        'bg-black': appStore.module === 'account'
                    }"
                    @click="changeModule"
                >
                    <i class="bi bi-person-fill" data-module="account"></i>
                    <h2 class="h5 m-0 p-0" data-module="account">Account</h2>
                </button>
            </section>
        </aside>
    </section>
</template>