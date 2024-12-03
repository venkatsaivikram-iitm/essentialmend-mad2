<script setup>
import ConfigHolder from '../utils/config-holder';
import { redirect, showInfoMsg } from "../utils/common-utils"

const handleLogout = () => {
    fetch('/logout', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(response => {
        showInfoMsg(response.data.message, response.result);
        redirect('/', 3000);
    })
    .catch(error => {
        showInfoMsg('Logout failed:', "danger");
    });
};
</script>

<template>
    <div class="d-flex flex-column align-items-center bg-white w-100 h-100 justify-content-center gap-4 text-center">
        <div class="d-flex gap-2 justify-content-center align-items-center">
            <i class="fs-2 bi bi-wrench-adjustable-circle"></i>
            <h1 class="h3 m-0">EssentialMend</h1>
        </div>
        <h2>Professional Request Declined</h2>
        <p class="fs-4">Hello, <span class="fw-bold">{{ConfigHolder.userInfo.name}}</span> ! Your professional request for <span class="fw-bold">{{ConfigHolder.service ? ConfigHolder.service.name : "{SERVICE CURRENTLY NOT AVAILABLE}"}}</span> service has been declined. <br />We value your time and patience. <br />Try again with a valid profile.</p>
        <button class="btn btn-danger" id="logout-btn" @click="handleLogout">Logout</button>
    </div>
</template>