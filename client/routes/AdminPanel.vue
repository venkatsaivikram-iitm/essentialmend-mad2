<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useAppStore } from '../stores/app-store';
import { showInfoMsg } from "../utils/common-utils";

const appStore = useAppStore();
const loading = ref(true);
const searchQuery = ref('');

const filteredServices = computed(() => {
  if (!searchQuery.value) return appStore.adminPanel.services;
  return appStore.adminPanel.services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredProfessionals = computed(() => {
  if (!searchQuery.value) return appStore.adminPanel.professionals;
  return appStore.adminPanel.professionals.filter(professional => 
    professional.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    professional.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    professional.service?.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    professional.location.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    professional.pincode.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredUsers = computed(() => {
  if (!searchQuery.value) return appStore.adminPanel.users;
  return appStore.adminPanel.users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.location.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.pincode.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const currentService = ref(null);
const currentProfessional = ref(null);
const currentUser = ref(null);

const serviceName = ref('');
const serviceDescription = ref('');
const servicePrice = ref(0);

const newServiceName = ref('');
const newServiceDescription = ref('');
const newServicePrice = ref(0);

watch(currentService, (newService) => {
  if (newService) {
    serviceName.value = newService.name;
    serviceDescription.value = newService.description;
    servicePrice.value = newService.price;
  }
});

const isServiceModified = computed(() => {
  if (!currentService.value) return false;
    const originalService = appStore.adminPanel.services.find(service => service.sid === currentService.value.sid);
  if (!originalService) return false;
  return (
    serviceName.value !== originalService.name ||
    serviceDescription.value !== originalService.description ||
    servicePrice.value !== originalService.price
  );
});

const setHTML = (element, html) => {
  element.innerHTML = html;
};

const handleServiceClick = (sid) => {
    currentService.value = appStore.adminPanel.services.find(service => service.sid === sid);
};

const handleProfessionalClick = (uid) => {
    currentProfessional.value = appStore.adminPanel.professionals.find(professional => professional.uid === uid);
};

const handleUserClick = (uid) => {
    currentUser.value = appStore.adminPanel.users.find(user => user.uid === uid);
};

const handleAddService = (event) => {
  event.stopPropagation();
  const name = newServiceName.value;
  const description = newServiceDescription.value;
  const price = newServicePrice.value;

  if (!name || !description || !price) {
    showInfoMsg("All fields are required", "failure");
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);
  formData.append('price', price);

  fetch('/api/services', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(response => {
    if (response.result === "success") {
        newServiceName.value = '';
        newServiceDescription.value = '';
        newServicePrice.value = 0;
        appStore.adminPanel.services.push(response.data.service);
        document.getElementById("service-add-modal-close-btn").click();
    }
    showInfoMsg(response.data.message, response.result);
  })
  .catch(error => showInfoMsg("Service add failed", "failure"));
};

const handleUpdateService = () => {
  const sid = currentService.value.sid;
  const name = serviceName.value;
  const description = serviceDescription.value;
  const price = servicePrice.value;

    const formData = new FormData();
  formData.append('sid', sid);
  formData.append('name', name);
  formData.append('description', description);
  formData.append('price', price);

  fetch(`/api/services`, {
    method: 'PUT',
    body: formData
  })
  .then(response => response.json())
  .then(response => {
    if (response.result === "success") {
      const service = appStore.adminPanel.services.find(service => service.sid === sid);
      if (service) {
        service["name"] = response.data.service.name;
        service["description"] = response.data.service.description;
        service["price"] = response.data.service.price;
      }
      document.getElementById("service-edit-modal-close-btn").click();
    }
    showInfoMsg(response.data.message, response.result);
  })
  .catch(error => showInfoMsg("Service update failed", "failure"));
};

const handleDeleteService = () => {
  const sid = currentService.value.sid;
  const formData = new FormData();
  formData.append('sid', sid);

  fetch('/api/services', {
    method: 'DELETE',
    body: formData
  })
  .then(response => response.json())
  .then(response => {
    if (response.result === "success") {
      const index = appStore.adminPanel.services.findIndex(service => service.sid === sid);
      if (index !== -1) {
        appStore.adminPanel.services.splice(index, 1);
      }
      document.getElementById("service-delete-modal-close-btn").click();
    }
    showInfoMsg(response.data.message, response.result);
  })
  .catch(error => showInfoMsg("Service delete failed", "failure"));
};

const handleDeleteUser = () => {
  const uid = currentUser.value.uid;
  const formData = new FormData();
  formData.append('uid', uid);
  formData.append('mode', 'delete');

  fetch('/api/user', {
    method: 'DELETE',
    body: formData
  })
  .then(response => response.json())
  .then(response => {
    if (response.result === "success") {
      const index = appStore.adminPanel.users.findIndex(user => user.uid === uid);
      if (index !== -1) {
        appStore.adminPanel.users.splice(index, 1);
      }
      document.getElementById("user-delete-modal-close-btn").click();
    }
    showInfoMsg(response.data.message, response.result);
  })
  .catch(error => showInfoMsg("User delete failed", "failure"));
};

const handleBlockUser = () => {
  const uid = currentUser.value.uid;
  const formData = new FormData();
  formData.append('uid', uid);
  formData.append('mode', currentUser.value.status === "active" ? 'block' : 'unblock');

  fetch('/api/user', {
    method: 'DELETE',
    body: formData
  })
  .then(response => response.json())
  .then(response => {
    if (response.result === "success") {
      const user = appStore.adminPanel.users.find(user => user.uid === uid);
      if (user) {
        user.status = currentUser.value.status === "active" ? "blocked" : "active";
      }
      document.getElementById("user-delete-modal-close-btn").click();
    }
    showInfoMsg(response.data.message, response.result);
  })
  .catch(error => showInfoMsg("User block failed", "failure"));
};

const handleDeleteProfessional = () => {
  const uid = currentProfessional.value.uid;
  const formData = new FormData();
  formData.append('uid', uid);
  formData.append('mode', 'delete');

  fetch('/api/user', {
    method: 'DELETE',
    body: formData
  })
  .then(response => response.json())
  .then(response => {
    if (response.result === "success") {
      const index = appStore.adminPanel.professionals.findIndex(professional => professional.uid === uid);
      if (index !== -1) {
        appStore.adminPanel.professionals.splice(index, 1);
      }
      document.getElementById("professional-delete-modal-close-btn").click();
    }
    showInfoMsg(response.data.message, response.result);
  })
  .catch(error => showInfoMsg("Professional delete failed", "failure"));
};

const handleBlockProfessional = () => {
  const uid = currentProfessional.value.uid;
  const formData = new FormData();
  formData.append('uid', uid);
  formData.append('mode', currentProfessional.value.status === "active" ? 'block' : 'unblock');

  fetch('/api/user', {
    method: 'DELETE',
    body: formData
  })
  .then(response => response.json())
  .then(response => {
    if (response.result === "success") {
      const professional = appStore.adminPanel.professionals.find(professional => professional.uid === uid);
      if (professional) {
        professional.status = currentProfessional.value.status === "active" ? "blocked" : "active";
      }
      document.getElementById("professional-delete-modal-close-btn").click();
    }
    showInfoMsg(response.data.message, response.result);
  })
  .catch(error => showInfoMsg("Professional block failed", "failure"));
};

const handleApproveProfessional = () => {
  const formData = new FormData();
  formData.append('uid', currentProfessional.value.uid);
  formData.append('mode', 'approve');

  fetch('/api/professionalrequest', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(response => {
    if (response.result === "success") {
      const professional = appStore.adminPanel.professionals.find(prof => prof.uid === currentProfessional.value.uid);
      if (professional) {
        professional.professionalRequest.status = "approved";
        professional.professionalRequest.statusInfo = "Professional request approved";
        professional.isPending = false;
        professional.isApproved = true;
        professional.isDeclined = false;
      }
      document.getElementById("professional-review-modal-close-btn").click();
    }
    showInfoMsg(response.data.message, response.result);
  })
  .catch(error => showInfoMsg("Professional approval failed", "failure"));
};

const handleDeclineProfessional = () => {
  const formData = new FormData();
  formData.append('uid', currentProfessional.value.uid);
  formData.append('mode', 'decline');

  fetch('/api/professionalrequest', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(response => {
    if (response.result === "success") {
      const professional = appStore.adminPanel.professionals.find(prof => prof.uid === currentProfessional.value.uid);
      if (professional) {
        professional.professionalRequest.status = "declined";
        professional.professionalRequest.statusInfo = "Professional request declined";
        professional.isPending = false;
        professional.isApproved = false;
        professional.isDeclined = true;
      }
      document.getElementById("professional-review-modal-close-btn").click();
    }
    showInfoMsg(response.data.message, response.result);
  })
  .catch(error => showInfoMsg("Professional decline failed", "failure"));
};

const handleDownloadServiceRequestReport = (uid) => {
  let url = '/api/servicerequestreport';
  if (uid) {
    url += `?uid=${uid}`;
  }
  fetch(url, {method: "GET"})
    .then(response => {
      if (response.ok) {
        return response.blob();
      } else {
        throw new Error('Failed to download report');
      }
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'closed_service_requests.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      showInfoMsg('Service request report downloaded successfully', 'success');
    })
    .catch(error => {
      showInfoMsg('Failed to download service request report', 'failure');
    });
}

const handleDownloadFullServiceRequestReport = (event) => {
  event?.stopPropagation();
  handleDownloadServiceRequestReport();
};

const handleDownloadProfessionalServiceRequestReport = (event) => {
  event?.stopPropagation();
  const uid = event?.target.dataset.uid;
  if (uid) {
    handleDownloadServiceRequestReport(uid)
  }
}

onMounted(() => {
  fetch('/api/adminpanel')
    .then(response => response.json())
    .then(response => {
      if (response.result === "success") {
        appStore.adminPanel = response.data;
      } else {
        showInfoMsg(response.data.message, response.result);
      }
    })
    .catch(error => {
      showInfoMsg('Failed to fetch admin panel data:', "danger");
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>

<template>
    <section class="flex-grow-1 d-flex flex-column p-2 bg-white h-100 rounded-start">
        <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <button class="nav-link active text-black" id="nav-services-tab" data-bs-toggle="tab" data-bs-target="#nav-services" type="button" role="tab" aria-controls="nav-services" aria-selected="true">Services</button>
                <button class="nav-link text-black" id="nav-professionals-tab" data-bs-toggle="tab" data-bs-target="#nav-professionals" type="button" role="tab" aria-controls="nav-professionals" aria-selected="false">Professionals</button>
                <button class="nav-link text-black" id="nav-users-tab" data-bs-toggle="tab" data-bs-target="#nav-users" type="button" role="tab" aria-controls="nav-users" aria-selected="false">Users</button>
            </div>
        </nav>
        <div class="tab-content flex-grow-1 overflow-scroll" id="nav-tabContent">
            <div class="tab-pane fade show active" id="nav-services" role="tabpanel" aria-labelledby="nav-services-tab">
                <div class="pt-2 pb-2 d-flex flex-column overflow-hidden">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="input-group mr-sm-2" id="service-search-wrapper">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                    <i class="bi bi-search"></i>
                                </div>
                            </div>
                            <input type="text" class="form-control" id="service-search-input" data-type="service" placeholder="Search Services" v-model="searchQuery">
                        </div>
                        <button class="btn btn-dark" id="add-service-btn" data-type="service" data-action="add" data-bs-toggle="modal" data-bs-target="#service-add-modal">Add Service</button>
                    </div>
                    <hr />
                    <div class="d-flex flex-grow-1 flex-column gap-2 overflow-scroll">
                        <div @click="handleServiceClick(service.sid)" v-if="filteredServices?.length > 0" v-for="service in filteredServices" :key="service.sid" class="d-flex bg-grayblack gap-4 px-4 rounded pt-2 pb-2" data-type="service" data-action="info" :data-value="service.name" :data-sid="service.sid" data-bs-toggle="modal" data-bs-target="#service-info-modal">
                            <div class="item-icon">
                                <i class="bi bi-tools service-item-icon"></i>
                            </div>
                            <div class="d-flex flex-grow-1 flex-column">
                                <h4>{{ service.name }}</h4>
                                <p class="text-truncate m-0"><span class="fw-bold">Description: </span>{{ service.description }}</p>
                                <p class="fs-6 m-0"><span class="fw-bold">Price: </span>{{ Number(service.price).toFixed(2) }} Rs</p>
                            </div>
                            <div class="align-self-center d-flex gap-2">
                                <button @click="handleServiceClick(service.sid)" class="btn btn-dark service-edit-modal-btn" data-type="service" data-action="edit" data-sid="{{service.sid}}" data-bs-toggle="modal" data-bs-target="#service-edit-modal">
                                    <i class="fs-5 bi bi-pencil-square"></i>
                                </button>
                                <button @click="handleServiceClick(service.sid)" class="fs-5 btn btn-danger service-delete-modal-btn" data-type="service" data-action="delete" :data-sid="service.sid" data-bs-toggle="modal" data-bs-target="#service-delete-modal">
                                    <i class="bi bi-trash3"></i>
                                </button>
                            </div>
                        </div>
                        <div v-else>
                            <p>No services available currently</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="nav-professionals" role="tabpanel" aria-labelledby="nav-professionals-tab">
                <div class="p-2 d-flex flex-column overflow-hidden">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="input-group mr-sm-2" id="professional-search-wrapper">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                    <i class="bi bi-search"></i>
                                </div>
                            </div>
                            <input type="text" class="form-control" id="professional-search-input" data-type="professional" placeholder="Search Professionals" v-model="searchQuery">
                        </div>
                        <button class="btn btn-dark" id="all-professional-service-request-report-download-btn" @click="handleDownloadFullServiceRequestReport">Download full Service Request Report</button>
                    </div>
                    <hr />
                    <div class="d-flex flex-grow-1 overflow-scroll flex-column gap-2">
                        <div @click="handleProfessionalClick(professional.uid)" v-if="filteredProfessionals?.length > 0" v-for="professional in filteredProfessionals" :key="professional.uid" class="d-flex bg-grayblack gap-4 px-4 rounded pt-2 pb-2 professional-item" data-action="info" data-type="professional" :data-value="`${professional.name},${professional.email}`" :data-uid="professional.uid" data-bs-toggle="modal" data-bs-target="#professional-info-modal">
                            <div class="item-icon">
                                <i class="bi bi-person-fill-gear service-item-icon"></i>
                            </div>
                            <div class="d-flex flex-grow-1 flex-column">
                                <h4>{{ professional.name }} | {{ professional.email }} | <span class="fw-normal">{{ professional.professionalRequest.status }}</span></h4>
                                <p class="text-truncate m-0"><span class="fw-bold">Service: </span>{{ professional.service ? professional.service.name : "Service unavailable" }} | <span class="fw-bold">Description: </span> {{ professional.description }}</p>
                                <p class="m-0"><span class="fw-bold">Location: </span>{{ professional.location }} | <span class="fw-bold">Pincode: </span>{{ professional.pincode }}</p>
                                <p class="fs-6 m-0"><span class="fw-bold">Rating: </span>{{ professional.rating || 0 }} &#9733; | <span class="fw-bold">Duration: </span>{{ professional.duration }} Hrs | <span class="fw-bold">Price: </span>{{ Number(professional.price).toFixed(2) }} Rs</p>
                            </div>
                            <div class="align-self-center d-flex gap-2">
                                <button @click="handleProfessionalClick(professional.uid)" v-if="professional.isPending && professional.service" class="btn btn-dark professional-review-btn" :data-uid="professional.uid" data-type="professional" data-action="review" data-bs-toggle="modal" data-bs-target="#professional-review-modal">
                                    <i class="bi bi-person-fill-check"></i>
                                    Review Request
                                </button>
                                <button v-if="professional.isApproved" class="btn btn-dark" @click="handleDownloadProfessionalServiceRequestReport" :data-uid="professional.uid">Download Service Request Report</button>
                                <button @click="handleProfessionalClick(professional.uid)" class="fs-5 btn btn-danger professional-delete-modal-btn" data-action="delete" data-type="professional" :data-uid="professional.uid" data-bs-toggle="modal" data-bs-target="#professional-delete-modal">
                                    <i class="bi bi-trash3"></i>
                                </button>
                            </div>
                        </div>
                        <div v-else>
                            <p>No services available currently</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="nav-users" role="tabpanel" aria-labelledby="nav-users-tab">
                <div class="p-2 d-flex flex-column overflow-hidden">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="input-group mr-sm-2" id="user-search-wrapper">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                    <i class="bi bi-search"></i>
                                </div>
                            </div>
                            <input type="text" class="form-control" id="user-search-input" data-type="user" placeholder="Search Users" v-model="searchQuery">
                        </div>
                    </div>
                    <hr />
                    <div class="d-flex flex-grow-1 overflow-scroll flex-column gap-2">
                        <div @click="handleUserClick(user.uid)" v-if="filteredUsers?.length > 0" v-for="user in filteredUsers" :key="user.uid" class="d-flex bg-grayblack gap-4 px-4 rounded pt-2 pb-2 user-item" data-type="user" data-action="info" :data-value="`${user.name},${user.email}`" :data-uid="user.uid" data-bs-toggle="modal" data-bs-target="#user-info-modal">
                            <div class="item-icon">
                                <i class="bi bi-person-fill"></i>
                            </div>
                            <div class="d-flex flex-grow-1 flex-column">
                                <h4>{{ user.name }} | {{ user.email }} | <span class="fw-normal">{{ user.status }}</span></h4>
                                <p class="m-0"><span class="fw-bold">Location: </span>{{ user.location }} | <span class="fw-bold">Pincode: </span>{{ user.pincode }}</p>
                            </div>
                            <div class="align-self-center">
                                <button @click="handleUserClick(user.uid)" class="fs-5 btn btn-danger user-delete-modal-btn" data-type="user" data-action="delete" :data-uid="user.uid" data-bs-toggle="modal" data-bs-target="#user-delete-modal">
                                    <i class="bi bi-trash3"></i>
                                </button>
                            </div>
                        </div>
                        <div v-else>
                            <p>No services available currently</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- service info modal -->
        <div class="modal fade" id="service-info-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Service Info</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="service-info-modal-close-btn"></button>
                    </div>
                    <div class="modal-body d-flex gap-4">
                        <div class="item-icon align-self-start item-info-icon">
                            <i class="bi bi-tools"></i>
                        </div>
                        <div id="service-info-modal-body">
                            <p class="m-0"><span class="fw-bold">Name: </span>{{ currentService?.name }}</p>
                            <p class="m-0"><span class="fw-bold">Description: </span>{{ currentService?.description }}</p>
                            <p class="m-0"><span class="fw-bold">Base Price: </span>{{ currentService?.price }} Rs</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- service add modal -->
        <div class="modal fade" id="service-add-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Add Service</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="service-add-modal-close-btn"></button>
                    </div>
                    <div class="modal-body" id="service-add-modal-body">
                        <div class="mb-3">
                            <label for="service-name" class="form-label fw-bold">Name</label>
                            <input type="text" class="form-control" id="service-name" placeholder="Enter service name" v-model="newServiceName">
                        </div>
                        <div class="mb-3">
                            <label for="service-description" class="form-label fw-bold">Description</label>
                            <textarea class="form-control" id="service-description" rows="3" placeholder="Enter service description" v-model="newServiceDescription"></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="service-price" class="form-label fw-bold">Price</label>
                            <input type="number" class="form-control" id="service-price" placeholder="Enter service price" v-model="newServicePrice">
                        </div>
                    </div>
                    <div class="modal-footer" id="service-add-modal-footer">
                        <button type="button" class="btn btn-dark" id="service-add-btn" @click="handleAddService">Add</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- service edit modal -->
        <div class="modal fade" id="service-edit-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Edit Service</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="service-edit-modal-close-btn"></button>
                    </div>
                    <div class="modal-body" id="service-edit-modal-body">
                        <div class="mb-3">
                            <label for="edit-service-name" class="form-label fw-bold">Name</label>
                            <input type="text" class="form-control" id="edit-service-name" v-model="serviceName">
                        </div>
                        <div class="mb-3">
                            <label for="edit-service-description" class="form-label fw-bold">Description</label>
                            <textarea class="form-control" id="edit-service-description" rows="3" v-model="serviceDescription"></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="edit-service-price" class="form-label fw-bold">Price</label>
                            <input type="number" class="form-control" id="edit-service-price" v-model="servicePrice">
                        </div>
                    </div>
                    <div class="modal-footer" id="service-edit-modal-footer">
                        <button type="button" class="btn btn-dark" id="service-edit-btn" :disabled="!isServiceModified" @click="handleUpdateService">Update</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- service delete modal -->
        <div class="modal fade" id="service-delete-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Delete Service</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="service-delete-modal-close-btn"></button>
                    </div>
                    <div class="modal-body" id="service-delete-modal-body">
                        <p class="m-0">Are you sure to <span class="fw-bold text-danger">DELETE</span> <span class="fw-bold">{{currentService?.name}}</span> service permanently? Click <span class="fw-bold">Delete</span> to delete permanently. Professionals with this service wont be able to access the platform anymore.</p>
                    </div>
                    <div class="modal-footer" id="service-delete-modal-footer">
                        <button type="button" class="btn btn-danger" id="service-delete-btn" @click="handleDeleteService">Delete</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- professional info modal -->
        <div class="modal fade" id="professional-info-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Professional Info</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="professional-info-modal-close-btn"></button>
                    </div>
                    <div class="modal-body d-flex gap-4">
                        <div class="item-icon align-self-start item-info-icon">
                            <i class="bi bi-person-fill-gear"></i>
                        </div>
                        <div id="professional-info-modal-body">
                            <p class="m-0"><span class="fw-bold">Name: </span>{{ currentProfessional?.name }}</p>
                            <p class="m-0"><span class="fw-bold">Email: </span>{{ currentProfessional?.email }}</p>
                            <p class="m-0"><span class="fw-bold">Role: </span>{{ currentProfessional?.role }}</p>
                            <p class="m-0"><span class="fw-bold">Status: </span>{{ currentProfessional?.status }}</p>
                            <p class="m-0"><span class="fw-bold">Location: </span>{{ currentProfessional?.location }}</p>
                            <p class="m-0"><span class="fw-bold">Pincode: </span>{{ currentProfessional?.pincode }}</p>
                            <p class="m-0"><span class="fw-bold">Service: </span>{{ currentProfessional?.service?.name || "Service unavailable" }}</p>
                            <p class="m-0"><span class="fw-bold">Description: </span>{{ currentProfessional?.description }}</p>
                            <p class="m-0"><span class="fw-bold">Price: </span>{{ currentProfessional?.price }} Rs</p>
                            <p class="m-0"><span class="fw-bold">Duration: </span>{{ currentProfessional?.duration }} Hrs</p>
                            <p class="m-0"><span class="fw-bold">Rating: </span>{{ currentProfessional?.rating }}</p>
                            <p class="m-0"><span class="fw-bold">Experience: </span>{{ currentProfessional?.experience }} Years</p>
                            <p class="m-0"><span class="fw-bold">Created At: </span>{{ new Date(Number(currentProfessional?.createdAt)).toLocaleString() }}</p>
                            <br />
                            <p class="m-0"><span class="fw-bold">Request Status: </span>{{ currentProfessional?.professionalRequest?.status }}</p>
                            <p class="m-0"><span class="fw-bold">Request Status Info: </span>{{ currentProfessional?.professionalRequest?.statusInfo }}</p>
                            <p class="m-0"><span class="fw-bold">Requested At: </span>{{ new Date(Number(currentProfessional?.professionalRequest?.createdAt)).toLocaleString() }}</p>
                            <p class="m-0"><span class="fw-bold">Request Closed At: </span>{{ currentProfessional?.professionalRequest?.closedAt ? new Date(Number(currentProfessional.value?.professionalRequest?.closedAt)).toLocaleString() : "-" }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- professional review modal -->
        <div class="modal fade" id="professional-review-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Review Professional</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="professional-review-modal-close-btn"></button>
                    </div>
                    <div class="modal-body" id="professional-review-modal-body">
                      <p class="m-0"><span class="fw-bold">Current Status: </span>{{ currentProfessional?.professionalRequest?.status }}</p>
                      <p class="m-0"><span class="fw-bold">Requested At: </span>{{ new Date(Number(currentProfessional?.professionalRequest?.createdAt)).toLocaleString() }}</p><br />
                      <p class="m-0">Review <span class="fw-bold">{{ currentProfessional?.name }} ({{ currentProfessional?.email }})</span> and click <span class="fw-bold text-success">Approve</span> to approve the professional or <span class="fw-bold text-danger">Decline</span> to decline the request.</p>
                    </div>
                    <div class="modal-footer" id="professional-review-modal-footer">
                        <button type="button" class="btn btn-danger" id="professional-decline-btn" @click="handleDeclineProfessional">Decline</button>
                        <button type="button" class="btn btn-success" id="professional-approve-btn" @click="handleApproveProfessional">Approve</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- professional delete modal -->
        <div class="modal fade" id="professional-delete-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Delete Professional</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="professional-delete-modal-close-btn"></button>
                    </div>
                    <div class="modal-body" id="professional-delete-modal-body">
                        <p class="m-0">Are you sure to <span class="fw-bold text-danger">DELETE</span> <span class="fw-bold">{{currentProfessional?.name}} ({{currentProfessional?.email}})</span> permanently? Click <span class="fw-bold">Delete</span> to delete permanently or <span class="fw-bold">Block</span> to block the professional (you can unblock later).</p>
                    </div>
                    <div class="modal-footer" id="professional-delete-modal-footer">
                        <button type="button" class="btn btn-dark" id="professional-block-btn" @click="handleBlockProfessional">{{ currentProfessional?.status === "active" ? "Block" : "Unblock" }}</button>
                        <button type="button" class="btn btn-danger" id="professional-delete-btn" @click="handleDeleteProfessional">Delete</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- user info modal -->
        <div class="modal fade" id="user-info-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">User Info</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="user-info-modal-close-btn"></button>
                    </div>
                    <div class="modal-body d-flex gap-4">
                        <div class="item-icon align-self-start item-info-icon">
                            <i class="bi bi-person-fill"></i>
                        </div>
                        <div id="user-info-modal-body">
                            <p class="m-0"><span class="fw-bold">Name: </span>{{ currentUser?.name }}</p>
                            <p class="m-0"><span class="fw-bold">Email: </span>{{ currentUser?.email }}</p>
                            <p class="m-0"><span class="fw-bold">Role: </span>{{ currentUser?.role }}</p>
                            <p class="m-0"><span class="fw-bold">Status: </span>{{ currentUser?.status }}</p>
                            <p class="m-0"><span class="fw-bold">Location: </span>{{ currentUser?.location }}</p>
                            <p class="m-0"><span class="fw-bold">Pincode: </span>{{ currentUser?.pincode }}</p>
                            <p class="m-0"><span class="fw-bold">Created At: </span>{{ new Date(Number(currentUser?.createdAt)).toLocaleString() }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- user delete modal -->
        <div class="modal fade" id="user-delete-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Delete User</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="user-delete-modal-close-btn"></button>
                    </div>
                    <div class="modal-body" id="user-delete-modal-body">
                        <p class="m-0">Are you sure to <span class="fw-bold text-danger">DELETE</span> <span class="fw-bold">{{currentUser?.name}} ({{currentUser?.email}})</span> permanently? Click <span class="fw-bold">Delete</span> to proceed.</p>
                    </div>
                    <div class="modal-footer" id="user-delete-modal-footer">
                        <button type="button" class="btn btn-dark" id="user-block-btn" @click="handleBlockUser">{{ currentUser?.status === "active" ? "Block" : "Unblock" }}</button>
                        <button type="button" class="btn btn-danger" id="user-delete-btn" @click="handleDeleteUser">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>