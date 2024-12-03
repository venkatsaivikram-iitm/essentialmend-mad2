<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAppStore } from '../stores/app-store';
import ConfigHolder from '../utils/config-holder';
import { showInfoMsg } from "../utils/common-utils";

const appStore = useAppStore();
const searchQuery = ref('');
const loading = ref(true);
const currentService = ref(null);

onMounted(() => {
    fetch('/api/serviceprofessionals')
    .then(response => response.json())
    .then(response => {
        appStore.serviceProfessionals = response.data.professionals;
    })
    .catch(error => {
        showInfoMsg("Failed to fetch professionals");;
    })
    .finally(() => {
        loading.value = false;
    });

});

const filteredProfessionals = computed(() => {
  if (!searchQuery.value) return appStore.serviceProfessionals;
  return appStore.serviceProfessionals.filter(professional => 
    professional.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    professional.service.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    professional.location.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    professional.pincode.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const handleServiceClick = (professionalId) => {
  currentService.value = appStore.serviceProfessionals.find(professional => professional.uid === professionalId);
};

const handleServiceRequest = () => {
  const formData = new FormData();
  formData.append('pid', currentService.value.uid);
  formData.append('sid', currentService.value.service.sid);
  formData.append('mode', 'request');

  fetch('/api/servicerequest', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
      .then(response => {
    showInfoMsg(response.data.message, response.result);
    if (response.result === 'success') {
      currentService.value["requestPending"] = true;
      const professional = appStore.serviceProfessionals.find(prof => prof.uid === currentService.value.uid);
      if (professional) {
        professional["requestPending"] = true;
      }
    }
  })
  .catch(error => {
    showInfoMsg("Failed to request service");
  });
};

</script>

<template>
    <section class="flex-grow-1 d-flex flex-column h-100 p-2 bg-white rounded-start">
        <section class="d-flex justify-content-between align-items-center">
        <h2 class="p-0 m-0">Services</h2>
        <div class="input-group mr-sm-2 w-auto" id="service-search-wrapper">
        <div class="input-group-prepend">
            <div class="input-group-text">
            <i class="bi bi-search"></i>
            </div>
        </div>
        <input type="text" class="form-control" id="service-search-input" placeholder="Search Services" v-model="searchQuery">
        </div>
        <!-- <select class="form-select d-block" id="services-sort" aria-label="Sort">
        <option value="default" selected>Default</option>
        <option value="dlh">Duration Low - High</option>
        <option value="dhl">Duration High - Low</option>
        <option value="plh">Price Low - High</option>
        <option value="phl">Price High - Low</option>
        </select> -->
    </section>
    <hr />
    <section class="services-main-wrapper flex-grow-1 overflow-scroll">
        <div id="services-wrapper">
        <p v-if="loading" id="search-not-found-text" :class="{ 'd-none': filteredProfessionals.length > 0 }">No matching services found for your search! Try a different one!</p>
        <div v-for="professional in filteredProfessionals" :key="professional.uid" class="service-item" :data-sid="professional.service.sid" :data-value="`${professional.name},${professional.email},${professional.service.name},${professional.location},${professional.pincode}`" :data-uid="professional.uid" data-bs-toggle="modal" data-bs-target="#service-info-modal" @click="handleServiceClick(professional.uid)">
            <div class="service-item-icon-wrapper">
            <i class="bi bi-tools service-item-icon"></i>
            </div>
            <hr style="width:100%;margin:0;border-color:black" />
            <div class="service-item-info-wrapper">
            <p class="text-truncate h-6 m-0"><span class="fw-bold">Professional: </span>{{ professional.name }}</p>
            <p class="text-truncate m-0"><span class="fw-bold">Service: </span>{{ professional.service.name }}</p>
            <p class="text-truncate m-0"><span class="fw-bold">Description: </span>{{ professional.description }}</p>
            <p class="text-truncate m-0"><span class="fw-bold">Location: </span>{{ professional.location }}</p>
            <p class="text-truncate m-0"><span class="fw-bold">Pincode: </span>{{ professional.pincode }}</p>
            <p class="text-truncate m-0"><span class="fw-bold">Duration: </span>{{ professional.duration }} Hrs</p>
            <p class="text-truncate m-0"><span class="fw-bold">Price: </span>{{ professional.price }} Rs</p>
            </div>
        </div>
        <p v-if="filteredProfessionals.length === 0">No professionals available at the moment! Come back after some time.</p>
        </div>
    </section>

    <!-- professional info modal -->
    <div class="modal fade" id="service-info-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">Service Info</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="service-info-modal-close-btn"></button>
            </div>
            <div class="modal-body d-flex flex-column gap-4">
            <div class="d-flex gap-4">
                <div class="d-flex flex-column gap-4">
                <div class="service-icon align-self-start item-info-icon">
                    <i class="bi bi-tools"></i>
                </div>
                <button v-if="ConfigHolder.isUser" class="btn btn-dark w-100" id="service-request-btn" :disabled="currentService?.requestPending" @click="handleServiceRequest">{{ currentService?.requestPending ? "Service Requested" : "Request Service" }}</button>
                </div>
                <div id="service-info-modal-body">
                  <div v-if="currentService" v-html="
                    `<p class='m-0'><span class='fw-bold'>Name: </span>${currentService.name}</p>
                    <p class='m-0'><span class='fw-bold'>Email: </span>${currentService.email}</p>
                    <p class='m-0'><span class='fw-bold'>Role: </span>${currentService.role}</p>
                    <p class='m-0'><span class='fw-bold'>Status: </span>${currentService.status}</p>
                    <p class='m-0'><span class='fw-bold'>Location: </span>${currentService.location}</p>
                    <p class='m-0'><span class='fw-bold'>Pincode: </span>${currentService.pincode}</p>
                    <p class='m-0'><span class='fw-bold'>Service: </span>${currentService.service.name}</p>
                    <p class='m-0'><span class='fw-bold'>Description: </span>${currentService.description}</p>
                    <p class='m-0'><span class='fw-bold'>Price: </span>${currentService.price} Rs</p>
                    <p class='m-0'><span class='fw-bold'>Duration: </span>${currentService.duration} Hrs</p>
                    <p class='m-0'><span class='fw-bold'>Rating: </span>${currentService.rating}</p>
                    <p class='m-0'><span class='fw-bold'>Experience: </span>${currentService.experience} Years</p>
                    <p class='m-0'><span class='fw-bold'>Created At: </span>${new Date(Number(currentService.createdAt))}</p>
                    <hr class='mt-2 mb-2' />
                    <p class='m-0'><span class='fw-bold'>Request Status: </span>${currentService.professionalRequest.status}</p>
                    <p class='m-0'><span class='fw-bold'>Request Status Info: </span>${currentService.professionalRequest.statusInfo}</p>
                    <p class='m-0'><span class='fw-bold'>Requested At: </span>${new Date(Number(currentService.professionalRequest.createdAt))}</p>
                    <p class='m-0'><span class='fw-bold'>Request Closed At: </span>${currentService.professionalRequest.closedAt ? new Date(Number(currentService.professionalRequest.closedAt)) : '-'}</p>`">
                  </div>
                </div>
            </div>
            <hr class="m-0"/>
            <div>
                <p class="fw-bold mb-1">Reviews:</p>
                <div id="service-review-body">
                  <div v-if="currentService && currentService.reviews">
                    <div v-for="review in currentService.reviews" :key="review.id" class="d-flex gap-4 border rounded p-2">
                      <div class="fs-1 align-self-center">
                        <i class="bi bi-chat-square-text-fill"></i>
                      </div>
                      <div class="d-flex flex-column">
                        <p class="m-0 fw-bold">{{ review.reviewerName }} | {{ review.reviewerEmail }} | {{ review.type }}</p>
                        <p class="m-0 small">{{ new Date(Number(review.createdAt)).toLocaleString() }}</p>
                        <p class="m-0">{{ review.review }}</p>
                        <p class="m-0"><span class="fw-bold">Rating: </span>{{ review.rating }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-else>No reviews for this professional by any users yet!</div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    </section>
</template>