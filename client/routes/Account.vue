<script setup>
import { ref, useTemplateRef } from 'vue';
import ConfigHolder from "../utils/config-holder";
import { showInfoMsg, redirect } from "../utils/common-utils";

const isUpdateEnabled = ref(false);
const name = ref(ConfigHolder.config.userInfo.name);
const location = ref(ConfigHolder.config.userInfo.location);
const pincode = ref(ConfigHolder.config.userInfo.pincode);
const description = ref(ConfigHolder.config.professionalInfo?.description);
const experience = ref(ConfigHolder.config.professionalInfo?.experience);
const duration = ref(ConfigHolder.config.professionalInfo?.duration);
const price = ref(ConfigHolder.config.professionalInfo?.price);
const modalCloseBtn = useTemplateRef("accountInfoModalCloseBtn");

function handleLogout() {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then(response => {
        showInfoMsg(response.data.message, response.result);
        setTimeout(redirect('/'), 3000);
    })
}

function handleInput() {
    let hasChanges = name.value !== ConfigHolder.config.userInfo.name ||
        location.value !== ConfigHolder.config.userInfo.location ||
        pincode.value !== ConfigHolder.config.userInfo.pincode;

    if (ConfigHolder.isProfessional) {
        hasChanges = hasChanges || description.value !== ConfigHolder.config.professionalInfo.description ||
            experience.value !== ConfigHolder.config.professionalInfo.experience ||
            duration.value !== ConfigHolder.config.professionalInfo.duration ||
            price.value !== ConfigHolder.config.professionalInfo.price;
    }
    isUpdateEnabled.value = hasChanges;
}

function handleUpdate() {
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('location', location.value);
    formData.append('pincode', pincode.value);
    if (ConfigHolder.isProfessional) {
        formData.append('description', description.value);
        formData.append('experience', experience.value);
        formData.append('duration', duration.value);
        formData.append('price', price.value);
    }

    fetch('/api/updateaccountinfo', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(response => {
        showInfoMsg(response.data.message, response.result);
        if (response.result === 'success') {
            Object.assign(ConfigHolder.config.userInfo, {
                name: name.value,
                location: location.value,
                pincode: pincode.value
            });
            if (ConfigHolder.isProfessional) {
                Object.assign(ConfigHolder.config.professionalInfo, {
                    description: description.value,
                    experience: experience.value,
                    duration: duration.value,
                    price: price.value
                });
            }
            isUpdateEnabled.value = false;
            modalCloseBtn.value.click();
        }
    });
}
</script>

<style>
.account-icon {
    font-size: 7.5rem;
}
</style>

<template>
    <section class="flex-grow-1 h-100 p-2 bg-white rounded-start overflow-scroll">
        <section class="d-flex flex-column align-items-center gap-4">
            <div class="account-icon">
                <i class="bi bi-person-fill"></i>
            </div>
            <div class="d-flex flex-column align-items-center">
                <p class="m-0"><span class="fw-bold">Name: </span><span>{{ name }}</span></p>
                <p class="m-0"><span class="fw-bold">Email: </span><span>{{ ConfigHolder.config.userInfo.email }}</span></p>
                <p class="m-0"><span class="fw-bold">Role: </span><span>{{ ConfigHolder.config.userInfo.role }}</span></p>
                <p class="m-0"><span class="fw-bold">Status: </span><span>{{ ConfigHolder.config.userInfo.status }}</span></p>
                <p class="m-0"><span class="fw-bold">Location: </span><span>{{ location }}</span></p>
                <p class="m-0"><span class="fw-bold">Pincode: </span><span>{{ pincode }}</span></p>
                <template v-if="ConfigHolder.isProfessional">
                    <p class="m-0"><span class="fw-bold">Description: </span><span>{{ description }}</span></p>
                    <p class="m-0"><span class="fw-bold">Service: </span><span>{{ ConfigHolder.config.service.name }}</span></p>
                    <p class="m-0"><span class="fw-bold">Experience: </span><span>{{ Number(experience).toFixed(2) }} yrs</span></p>
                    <p class="m-0"><span class="fw-bold">Price: </span><span>{{ Number(price).toFixed(2) }} Rs</span></p>
                    <p class="m-0"><span class="fw-bold">Duration: </span><span>{{ Number(duration).toFixed(2) }} hrs</span></p>
                    <p class="m-0"><span class="fw-bold">Rating: </span><span>{{ Number(ConfigHolder.config.professionalInfo.rating).toFixed(2) }}</span></p>
                </template>
                <p class="m-0"><span class="fw-bold">Created At: </span><span>{{ new Date(Number(ConfigHolder.config.userInfo.createdAt)).toLocaleString() }}</span></p>
            </div>
            <div class="d-flex gap-2">
                <button v-if="!ConfigHolder.isAdmin" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#account-info-edit-modal">Edit Info</button>
                <button class="btn btn-danger" @click="handleLogout">Logout</button>
            </div>
        </section>
    </section>

    <div class="modal fade" id="account-info-edit-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Edit Account Info</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="account-info-edit-modal-close-btn" ref="accountInfoModalCloseBtn"></button>
                </div>
                <div class="modal-body" id="account-info-edit-modal-body">
                    <div class="mb-3">
                        <label for="name" class="form-label fw-bold">Name</label>
                        <input type="text" class="form-control" id="name" name="name" v-model="name" @input="handleInput">
                    </div>
                    <div class="mb-3">
                        <label for="location" class="form-label fw-bold">Location</label>
                        <input type="text" class="form-control" id="location" name="location" v-model="location" @input="handleInput">
                    </div>
                    <div class="mb-3">
                        <label for="pincode" class="form-label fw-bold">Pincode</label>
                        <input type="number" maxlength="6" class="form-control" id="pincode" name="pincode" v-model="pincode" @input="handleInput">
                    </div>
                    <template v-if="ConfigHolder.isProfessional">
                        <div class="mb-3">
                            <label for="description" class="form-label fw-bold">Description</label>
                            <input type="text" class="form-control" id="description" data-type="professional" name="description" v-model="description" @input="handleInput">
                        </div>
                        <div class="mb-3">
                            <label for="experience" class="form-label fw-bold">Experience</label>
                            <input type="number" class="form-control" id="experience" data-type="professional" name="experience" v-model="experience" @input="handleInput">
                        </div>
                        <div class="mb-3">
                            <label for="duration" class="form-label fw-bold">Duration</label>
                            <input type="number" class="form-control" id="duration" data-type="professional" name="duration" v-model="duration" @input="handleInput">
                        </div>
                        <div class="mb-3">
                            <label for="price" class="form-label fw-bold">Price</label>
                            <input type="number" class="form-control" id="price" data-type="professional" name="price" v-model="price" @input="handleInput">
                        </div>
                    </template>
                </div>
                <div class="modal-footer" id="account-info-edit-modal-footer">
                    <button type="button" class="btn btn-dark" :disabled="!isUpdateEnabled" id="account-info-edit-btn" @click="handleUpdate">Update</button>
                </div>
            </div>
        </div>
    </div>
</template>