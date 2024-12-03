<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAppStore } from '../stores/app-store';
import { showInfoMsg } from "../utils/common-utils";
import ConfigHolder from '../utils/config-holder';

const appStore = useAppStore();
const loading = ref(true);
const currentServiceRequest = ref(null);
const serviceRequestReviewText = ref('');
const serviceRequestReviewRating = ref('');

const getColorClass = (requestStatus) => {
    if (requestStatus === "pending") {
        return "bg-grayblack";
    } else if (requestStatus === "inprogress") {
        return "bg-info";
    } else if (requestStatus === "completed") {
        return "bg-success";
    } else if (requestStatus === "cancelled") {
        return "bg-danger";
    }
    return "";
};

const canAcceptServiceRequest = computed(() => {
    return appStore.serviceRequests.every(request => request.status !== 'inprogress');
});

onMounted(() => {
        fetch('/api/servicerequest')
        .then(response => response.json())
        .then(response => {
            appStore.serviceRequests = response.data.serviceRequests;
        })
        .catch(error => {
            showInfoMsg("Failed to fetch service requests");
        })
        .finally(() => {
            loading.value = false;
        });
    }
);



const handleServiceRequestClick = (reqid) => {
    currentServiceRequest.value = appStore.serviceRequests.find(request => request.reqid === reqid);
};

const handleServiceClick = (sid) => {
    currentService.value = appStore.services.find(service => service.sid === sid);
};

const handleProfessionalClick = (uid) => {
    currentProfessional.value = appStore.professionals.find(professional => professional.uid === uid);
};

const getRevieweeInfo = () => {
    return currentServiceRequest?.value?.pid === ConfigHolder.uid ? currentServiceRequest?.value?.userInfo : currentServiceRequest?.value?.professionalInfo;
};

const handleAcceptServiceRequest = () => {
    const body = new FormData();
    body.append("mode", ConfigHolder.isProfessional ? "accept" : "complete");
    body.append("pid", currentServiceRequest.value.pid);
    body.append("sid", currentServiceRequest.value.sid);
    body.append("cid", currentServiceRequest.value.cid);
    body.append("reqid", currentServiceRequest.value.reqid);

    fetch('/api/servicerequest', {
        method: 'POST',
        body: body
    })
    .then(response => response.json())
    .then(response => {
        showInfoMsg(response.data.message, response.result);
        if (response.result === "success") {
            const serviceRequest = appStore.serviceRequests.find(serviceRequest => serviceRequest.reqid === currentServiceRequest.value.reqid);
            if (serviceRequest) {
                serviceRequest["status"] = response.data.serviceRequest.status;
                serviceRequest["statusInfo"] = response.data.serviceRequest.statusInfo;
                serviceRequest["closedAt"] = response.data.serviceRequest.closedAt;
                serviceRequest["isPending"] = serviceRequest.status === "pending";
                serviceRequest["isInProgress"] = serviceRequest.status === "inprogress";
                serviceRequest["isCompleted"] = serviceRequest.status === "completed";
            }
            document.getElementById('service-request-accept-close-btn').click();
        }
    })
    .catch(error => {
        showInfoMsg("Failed to accept/complete service request", "danger");
    });
};

const handleCancelServiceRequest = () => {
    const body = new FormData();
    body.append("mode", "cancel");
    body.append("pid", currentServiceRequest.value.pid);
    body.append("sid", currentServiceRequest.value.sid);
    body.append("cid", currentServiceRequest.value.cid);
    body.append("reqid", currentServiceRequest.value.reqid);

    fetch('/api/servicerequest', {
        method: 'POST',
        body: body
    })
    .then(response => response.json())
    .then(response => {
        showInfoMsg(response.data.message, response.result);
        if (response.result === "success") {
            const serviceRequest = appStore.serviceRequests.find(serviceRequest => serviceRequest.reqid === currentServiceRequest.value.reqid);
            if (serviceRequest) {
                serviceRequest["status"] = response.data.status;
                serviceRequest["statusInfo"] = response.data.serviceRequest.statusInfo;
                serviceRequest["closedAt"] = response.data.serviceRequest.closedAt;
                serviceRequest["isPending"] = serviceRequest.status === "pending";
                serviceRequest["isInProgress"] = serviceRequest.status === "inprogress";
                serviceRequest["isCompleted"] = serviceRequest.status === "completed";
                serviceRequest["isCancelled"] = serviceRequest.status === "cancelled";
            }
            document.getElementById('service-request-cancel-close-btn').click();
        }
    })
    .catch(error => {
        showInfoMsg("Failed to cancel service request", "danger");
    });
};

const handlePostReview = () => {
    const reviewerUid = ConfigHolder.uid;
    const revieweeUid = [currentServiceRequest.value.pid, currentServiceRequest.value.cid].filter((i) => i !== reviewerUid).at(0);
    const reviewText = serviceRequestReviewText.value;
    const reviewRating = serviceRequestReviewRating.value ? String(serviceRequestReviewRating.value) : '';
    const reqid = currentServiceRequest.value.reqid;
    if (reviewerUid && revieweeUid && reviewText && reviewRating && reqid) {
        const body = new FormData();
        body.append("reviewType", "review"); // TODO: handle review type
        body.append("reviewerUid", reviewerUid);
        body.append("revieweeUid", revieweeUid);
        body.append("reviewText", reviewText);
        body.append("reviewRating", reviewRating);
        body.append("reqid", reqid);

        fetch("/api/review", {
            method: "POST",
            body
        })
        .then((response) => response.json())
        .then((response) => {
            showInfoMsg(response.data.message, response.result);
            if (response.result === "success") {
                serviceRequestReviewText.value = "";
                serviceRequestReviewRating.value = "";
                const serviceRequest = appStore.serviceRequests.find(serviceRequest => serviceRequest.reqid === currentServiceRequest.value.reqid);
                if (serviceRequest) {
                    if (serviceRequest.reviews) {
                        serviceRequest["reviews"].unshift(response.data.review);
                    } else {
                        serviceRequest["reviews"] = [response.data.review];
                    }
                }
                if (currentServiceRequest.review) {
                    currentServiceRequest.review.unshift(response.data.review);
                } else {
                    currentServiceRequest.review = [response.data.review];
                }
            }
        }).catch((error) => {
            showInfoMsg("Error occurred in reviewing the service, Try again", "danger");
        });
    } else {
        showInfoMsg("Please provide all the review details", "warning");
    }
};
</script>

<template>
    <section class="flex-grow-1 d-flex flex-column h-100 p-2 bg-white rounded-start">
        <h1>Service Requests</h1>
        <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <button class="nav-link active text-black" id="nav-all-service-requests-tab" data-bs-toggle="tab" data-bs-target="#nav-all-service-requests-panel" type="button" role="tab" aria-controls="nav-all-service-requests-panel" aria-selected="true">All Requests</button>
                <button class="nav-link text-black" id="nav-pending-service-requests-tab" data-bs-toggle="tab" data-bs-target="#nav-pending-service-requests-panel" type="button" role="tab" aria-controls="nav-pending-service-requests-panel" aria-selected="false">Pending</button>
                <button class="nav-link text-black" id="nav-inprogress-service-requests-tab" data-bs-toggle="tab" data-bs-target="#nav-inprogress-service-requests-panel" type="button" role="tab" aria-controls="nav-inprogress-service-requests-panel" aria-selected="false">InProgress</button>
                <button class="nav-link text-black" id="nav-cancelled-service-requests-tab" data-bs-toggle="tab" data-bs-target="#nav-cancelled-service-requests-panel" type="button" role="tab" aria-controls="nav-cancelled-service-requests-panel" aria-selected="false">Cancelled</button>
                <button class="nav-link text-black" id="nav-completed-service-requests-tab" data-bs-toggle="tab" data-bs-target="#nav-completed-service-requests-panel" type="button" role="tab" aria-controls="nav-completed-service-requests-panel" aria-selected="false">Completed</button>
            </div>
        </nav>
        <div class="tab-content flex-grow-1 overflow-scroll" id="nav-tabContent">
            <!-- All Requests Tab -->
            <div class="tab-pane fade show active" id="nav-all-service-requests-panel" role="tabpanel" aria-labelledby="nav-all-service-requests-tab">
                <p v-if="loading" id="all-service-request-not-found-text">Service requests loading</p>
                <p v-else-if="!loading && appStore.serviceRequests.length === 0">No Service requests Yet!</p>
                <div v-else class="pt-2 pb-2 d-flex flex-column gap-2 align-items-start h-100 overflow-hidden">
                    <div v-for="serviceRequest in appStore.serviceRequests" :key="serviceRequest.reqid" :class="['p-2 rounded d-flex gap-4 align-items-center w-100 service-request-item', getColorClass(serviceRequest.status)]" @click="handleServiceRequestClick(serviceRequest.reqid)" data-bs-toggle="modal" data-bs-target="#service-request-info-modal">
                        <div class="item-icon">
                            <i class="bi bi-hammer"></i>
                        </div>
                        <div class="flex-grow-1">
                            <p class="m-0" v-if="ConfigHolder.isAdmin"><span class="fw-bold">Service: </span>{{ serviceRequest.serviceInfo.name }} | <span class="fw-bold">Professional: </span>{{ serviceRequest.professionalInfo.name }} ({{ serviceRequest.professionalInfo.email }}) | <span class="fw-bold">User: </span>{{ serviceRequest.userInfo.name }} ({{ serviceRequest.userInfo.email }})</p>
                            <p class="m-0" v-else-if="ConfigHolder.isProfessional"><span class="fw-bold">User: </span>{{ serviceRequest.userInfo.name }} ({{ serviceRequest.userInfo.email }})</p>
                            <p class="m-0" v-else-if="ConfigHolder.isUser"><span class="fw-bold">Service: </span>{{ serviceRequest.serviceInfo.name }} | <span class="fw-bold">Professional: </span>{{ serviceRequest.professionalInfo.name }} ({{ serviceRequest.professionalInfo.email }})</p>
                            <p class="m-0"><span class="fw-bold">Status: </span>{{ serviceRequest.status }}</p>
                            <p class="m-0"><span class="fw-bold">Status Info: </span>{{ serviceRequest.statusInfo }}</p>
                            <p class="m-0"><span class="fw-bold">Created At: </span>{{ new Date(Number(serviceRequest.createdAt)) }}</p>
                            <p v-if="serviceRequest.isCompleted || serviceRequest.isCancelled" class="m-0"><span class="fw-bold">Closed At: </span>{{ new Date(Number(serviceRequest.closedAt)) }}</p>
                        </div>
                        <div class="d-flex gap-2" v-if="serviceRequest.isPending || serviceRequest.isInProgress">
                            <button @click="handleServiceRequestClick(serviceRequest.reqid)" v-if="(ConfigHolder.isUser && serviceRequest.isInProgress) || (ConfigHolder.isProfessional && serviceRequest.isPending && canAcceptServiceRequest)" class="btn btn-success service-request-accept-btn" @click.stop data-bs-toggle="modal" data-bs-target="#service-request-accept-modal">
                                <i class="bi bi-check-square"></i>
                            </button>
                            <button @click="handleServiceRequestClick(serviceRequest.reqid)" class="btn btn-danger service-request-cancel-btn" @click.stop data-bs-toggle="modal" data-bs-target="#service-request-cancel-modal">
                                <i class="bi bi-x-square"></i>
                            </button>
                        </div>
                        <div class="d-flex gap-2" v-if="(ConfigHolder.isUser || ConfigHolder.isProfessional) && (serviceRequest.isCancelled || serviceRequest.isCompleted)">
                            <button @click="handleServiceRequestClick(serviceRequest.reqid)" class="btn btn-dark service-request-review-btn" @click.stop data-bs-toggle="modal" data-bs-target="#service-request-review-modal">Review</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Pending Requests Tab -->
            <div class="tab-pane fade" id="nav-pending-service-requests-panel" role="tabpanel" aria-labelledby="nav-pending-service-requests-tab">
                <p v-if="loading" id="all-service-request-not-found-text">Service requests loading</p>
                <p v-else-if="!loading && appStore.serviceRequests.filter((serviceRequest) => serviceRequest.isPending).length === 0">No Pending Service Requests Yet!</p>
                <div v-else class="pt-2 pb-2 d-flex flex-column gap-2 align-items-start h-100 overflow-hidden">
                    <div v-for="serviceRequest in appStore.serviceRequests.filter((serviceRequest) => serviceRequest.isPending)" :key="serviceRequest.reqid" :class="['p-2 rounded d-flex gap-4 align-items-center w-100 service-request-item', getColorClass(serviceRequest.status)]" @click="handleServiceRequestClick(serviceRequest.reqid)" data-bs-toggle="modal" data-bs-target="#service-request-info-modal">
                        <div class="item-icon">
                            <i class="bi bi-hammer"></i>
                        </div>
                        <div class="flex-grow-1">
                            <p class="m-0" v-if="ConfigHolder.isAdmin"><span class="fw-bold">Service: </span>{{ serviceRequest.serviceInfo.name }} | <span class="fw-bold">Professional: </span>{{ serviceRequest.professionalInfo.name }} ({{ serviceRequest.professionalInfo.email }}) | <span class="fw-bold">User: </span>{{ serviceRequest.userInfo.name }} ({{ serviceRequest.userInfo.email }})</p>
                            <p class="m-0" v-else-if="ConfigHolder.isProfessional"><span class="fw-bold">User: </span>{{ serviceRequest.userInfo.name }} ({{ serviceRequest.userInfo.email }})</p>
                            <p class="m-0" v-else-if="ConfigHolder.isUser"><span class="fw-bold">Service: </span>{{ serviceRequest.serviceInfo.name }} | <span class="fw-bold">Professional: </span>{{ serviceRequest.professionalInfo.name }} ({{ serviceRequest.professionalInfo.email }})</p>
                            <p class="m-0"><span class="fw-bold">Status: </span>{{ serviceRequest.status }}</p>
                            <p class="m-0"><span class="fw-bold">Status Info: </span>{{ serviceRequest.statusInfo }}</p>
                            <p class="m-0"><span class="fw-bold">Created At: </span>{{ new Date(Number(serviceRequest.createdAt)) }}</p>
                            <p v-if="serviceRequest.isCompleted || serviceRequest.isCancelled" class="m-0"><span class="fw-bold">Closed At: </span>{{ new Date(Number(serviceRequest.closedAt)) }}</p>
                        </div>
                        <div class="d-flex gap-2" v-if="serviceRequest.isPending || serviceRequest.isInProgress">
                            <button @click="handleServiceRequestClick(serviceRequest.reqid)" v-if="(ConfigHolder.isUser && serviceRequest.isInProgress) || (ConfigHolder.isProfessional && serviceRequest.isPending && canAcceptServiceRequest)" class="btn btn-success service-request-accept-btn" @click.stop data-bs-toggle="modal" data-bs-target="#service-request-accept-modal">
                                <i class="bi bi-check-square"></i>
                            </button>
                            <button @click="handleServiceRequestClick(serviceRequest.reqid)" class="btn btn-danger service-request-cancel-btn" @click.stop data-bs-toggle="modal" data-bs-target="#service-request-cancel-modal">
                                <i class="bi bi-x-square"></i>
                            </button>
                        </div>
                        <div class="d-flex gap-2" v-if="(ConfigHolder.isUser || ConfigHolder.isProfessional) && (serviceRequest.isCancelled || serviceRequest.isCompleted)">
                            <button @click="handleServiceRequestClick(serviceRequest.reqid)" class="btn btn-dark service-request-review-btn" @click.stop data-bs-toggle="modal" data-bs-target="#service-request-review-modal">Review</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- InProgress Requests Tab -->
            <div class="tab-pane fade" id="nav-inprogress-service-requests-panel" role="tabpanel" aria-labelledby="nav-inprogress-service-requests-tab">
                <p v-if="loading" id="all-service-request-not-found-text">Service requests loading</p>
                <p v-else-if="!loading && appStore.serviceRequests.filter((serviceRequest) => serviceRequest.isInProgress).length === 0">No InProgress Service Requests Yet!</p>
                <div v-else class="pt-2 pb-2 d-flex flex-column gap-2 align-items-start h-100 overflow-hidden">
                    <div v-for="serviceRequest in appStore.serviceRequests.filter((serviceRequest) => serviceRequest.isInProgress)" :key="serviceRequest.reqid" :class="['p-2 rounded d-flex gap-4 align-items-center w-100 service-request-item', getColorClass(serviceRequest.status)]" @click="handleServiceRequestClick(serviceRequest.reqid)" data-bs-toggle="modal" data-bs-target="#service-request-info-modal">
                        <div class="item-icon">
                            <i class="bi bi-hammer"></i>
                        </div>
                        <div class="flex-grow-1">
                            <p class="m-0" v-if="ConfigHolder.isAdmin"><span class="fw-bold">Service: </span>{{ serviceRequest.serviceInfo.name }} | <span class="fw-bold">Professional: </span>{{ serviceRequest.professionalInfo.name }} ({{ serviceRequest.professionalInfo.email }}) | <span class="fw-bold">User: </span>{{ serviceRequest.userInfo.name }} ({{ serviceRequest.userInfo.email }})</p>
                            <p class="m-0" v-else-if="ConfigHolder.isProfessional"><span class="fw-bold">User: </span>{{ serviceRequest.userInfo.name }} ({{ serviceRequest.userInfo.email }})</p>
                            <p class="m-0" v-else-if="ConfigHolder.isUser"><span class="fw-bold">Service: </span>{{ serviceRequest.serviceInfo.name }} | <span class="fw-bold">Professional: </span>{{ serviceRequest.professionalInfo.name }} ({{ serviceRequest.professionalInfo.email }})</p>
                            <p class="m-0"><span class="fw-bold">Status: </span>{{ serviceRequest.status }}</p>
                            <p class="m-0"><span class="fw-bold">Status Info: </span>{{ serviceRequest.statusInfo }}</p>
                            <p class="m-0"><span class="fw-bold">Created At: </span>{{ new Date(Number(serviceRequest.createdAt)) }}</p>
                            <p v-if="serviceRequest.isCompleted || serviceRequest.isCancelled" class="m-0"><span class="fw-bold">Closed At: </span>{{ new Date(Number(serviceRequest.closedAt)) }}</p>
                        </div>
                        <div class="d-flex gap-2" v-if="serviceRequest.isPending || serviceRequest.isInProgress">
                            <button @click="handleServiceRequestClick(serviceRequest.reqid)" v-if="(ConfigHolder.isUser && serviceRequest.isInProgress) || (ConfigHolder.isProfessional && serviceRequest.isPending && canAcceptServiceRequest)" class="btn btn-success service-request-accept-btn" @click.stop data-bs-toggle="modal" data-bs-target="#service-request-accept-modal">
                                <i class="bi bi-check-square"></i>
                            </button>
                            <button @click="handleServiceRequestClick(serviceRequest.reqid)" class="btn btn-danger service-request-cancel-btn" @click.stop data-bs-toggle="modal" data-bs-target="#service-request-cancel-modal">
                                <i class="bi bi-x-square"></i>
                            </button>
                        </div>
                        <div class="d-flex gap-2" v-if="(ConfigHolder.isUser || ConfigHolder.isProfessional) && (serviceRequest.isCancelled || serviceRequest.isCompleted)">
                            <button @click="handleServiceRequestClick(serviceRequest.reqid)" class="btn btn-dark service-request-review-btn" @click.stop data-bs-toggle="modal" data-bs-target="#service-request-review-modal">Review</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Cancelled Requests Tab -->
            <div class="tab-pane fade" id="nav-cancelled-service-requests-panel" role="tabpanel" aria-labelledby="nav-cancelled-service-requests-tab">
                <p v-if="loading" id="all-service-request-not-found-text">Service requests loading</p>
                <p v-else-if="!loading && appStore.serviceRequests.filter((serviceRequest) => serviceRequest.isCancelled).length === 0">No Cancelled Service Requests Yet!</p>
                <div v-else class="pt-2 pb-2 d-flex flex-column gap-2 align-items-start h-100 overflow-hidden">
                    <div v-for="serviceRequest in appStore.serviceRequests.filter((serviceRequest) => serviceRequest.isCancelled)" :key="serviceRequest.reqid" :class="['p-2 rounded d-flex gap-4 align-items-center w-100 service-request-item', getColorClass(serviceRequest.status)]" @click="handleServiceRequestClick(serviceRequest.reqid)" data-bs-toggle="modal" data-bs-target="#service-request-info-modal">
                        <div class="item-icon">
                            <i class="bi bi-hammer"></i>
                        </div>
                        <div class="flex-grow-1">
                            <p class="m-0" v-if="ConfigHolder.isAdmin"><span class="fw-bold">Service: </span>{{ serviceRequest.serviceInfo.name }} | <span class="fw-bold">Professional: </span>{{ serviceRequest.professionalInfo.name }} ({{ serviceRequest.professionalInfo.email }}) | <span class="fw-bold">User: </span>{{ serviceRequest.userInfo.name }} ({{ serviceRequest.userInfo.email }})</p>
                            <p class="m-0" v-else-if="ConfigHolder.isProfessional"><span class="fw-bold">User: </span>{{ serviceRequest.userInfo.name }} ({{ serviceRequest.userInfo.email }})</p>
                            <p class="m-0" v-else-if="ConfigHolder.isUser"><span class="fw-bold">Service: </span>{{ serviceRequest.serviceInfo.name }} | <span class="fw-bold">Professional: </span>{{ serviceRequest.professionalInfo.name }} ({{ serviceRequest.professionalInfo.email }})</p>
                            <p class="m-0"><span class="fw-bold">Status: </span>{{ serviceRequest.status }}</p>
                            <p class="m-0"><span class="fw-bold">Status Info: </span>{{ serviceRequest.statusInfo }}</p>
                            <p class="m-0"><span class="fw-bold">Created At: </span>{{ new Date(Number(serviceRequest.createdAt)) }}</p>
                            <p v-if="serviceRequest.isCompleted || serviceRequest.isCancelled" class="m-0"><span class="fw-bold">Closed At: </span>{{ new Date(Number(serviceRequest.closedAt)) }}</p>
                        </div>
                        <div class="d-flex gap-2" v-if="serviceRequest.isPending || serviceRequest.isInProgress">
                            <button @click="handleServiceRequestClick(serviceRequest.reqid)" v-if="(ConfigHolder.isUser && serviceRequest.isInProgress) || (ConfigHolder.isProfessional && serviceRequest.isPending && canAcceptServiceRequest)" class="btn btn-success service-request-accept-btn" @click.stop data-bs-toggle="modal" data-bs-target="#service-request-accept-modal">
                                <i class="bi bi-check-square"></i>
                            </button>
                            <button @click="handleServiceRequestClick(serviceRequest.reqid)" class="btn btn-danger service-request-cancel-btn" @click.stop data-bs-toggle="modal" data-bs-target="#service-request-cancel-modal">
                                <i class="bi bi-x-square"></i>
                            </button>
                        </div>
                        <div class="d-flex gap-2" v-if="(ConfigHolder.isUser || ConfigHolder.isProfessional) && (serviceRequest.isCancelled || serviceRequest.isCompleted)">
                            <button @click="handleServiceRequestClick(serviceRequest.reqid)" class="btn btn-dark service-request-review-btn" @click.stop data-bs-toggle="modal" data-bs-target="#service-request-review-modal">Review</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Completed Requests Tab -->
            <div class="tab-pane fade" id="nav-completed-service-requests-panel" role="tabpanel" aria-labelledby="nav-completed-service-requests-tab">
                <p v-if="loading" id="all-service-request-not-found-text">Service requests loading</p>
                <p v-else-if="!loading && appStore.serviceRequests.filter((serviceRequest) => serviceRequest.isCompleted).length === 0">No Completed Service Requests Yet!</p>
                <div v-else class="pt-2 pb-2 d-flex flex-column gap-2 align-items-start h-100 overflow-hidden">
                    <div v-for="serviceRequest in appStore.serviceRequests.filter((serviceRequest) => serviceRequest.isCompleted)" :key="serviceRequest.reqid" :class="['p-2 rounded d-flex gap-4 align-items-center w-100 service-request-item', getColorClass(serviceRequest.status)]" @click="handleServiceRequestClick(serviceRequest.reqid)" data-bs-toggle="modal" data-bs-target="#service-request-info-modal">
                        <div class="item-icon">
                            <i class="bi bi-hammer"></i>
                        </div>
                        <div class="flex-grow-1">
                            <p class="m-0" v-if="ConfigHolder.isAdmin"><span class="fw-bold">Service: </span>{{ serviceRequest.serviceInfo.name }} | <span class="fw-bold">Professional: </span>{{ serviceRequest.professionalInfo.name }} ({{ serviceRequest.professionalInfo.email }}) | <span class="fw-bold">User: </span>{{ serviceRequest.userInfo.name }} ({{ serviceRequest.userInfo.email }})</p>
                            <p class="m-0" v-else-if="ConfigHolder.isProfessional"><span class="fw-bold">User: </span>{{ serviceRequest.userInfo.name }} ({{ serviceRequest.userInfo.email }})</p>
                            <p class="m-0" v-else-if="ConfigHolder.isUser"><span class="fw-bold">Service: </span>{{ serviceRequest.serviceInfo.name }} | <span class="fw-bold">Professional: </span>{{ serviceRequest.professionalInfo.name }} ({{ serviceRequest.professionalInfo.email }})</p>
                            <p class="m-0"><span class="fw-bold">Status: </span>{{ serviceRequest.status }}</p>
                            <p class="m-0"><span class="fw-bold">Status Info: </span>{{ serviceRequest.statusInfo }}</p>
                            <p class="m-0"><span class="fw-bold">Created At: </span>{{ new Date(Number(serviceRequest.createdAt)) }}</p>
                            <p v-if="serviceRequest.isCompleted || serviceRequest.isCancelled" class="m-0"><span class="fw-bold">Closed At: </span>{{ new Date(Number(serviceRequest.closedAt)) }}</p>
                        </div>
                        <div class="d-flex gap-2" v-if="serviceRequest.isPending || serviceRequest.isInProgress">
                            <button @click="handleServiceRequestClick(serviceRequest.reqid)" v-if="(ConfigHolder.isUser && serviceRequest.isInProgress) || (ConfigHolder.isProfessional && serviceRequest.isPending && canAcceptServiceRequest)" class="btn btn-success service-request-accept-btn" @click.stop data-bs-toggle="modal" data-bs-target="#service-request-accept-modal">
                                <i class="bi bi-check-square"></i>
                            </button>
                            <button @click="handleServiceRequestClick(serviceRequest.reqid)" class="btn btn-danger service-request-cancel-btn" @click.stop data-bs-toggle="modal" data-bs-target="#service-request-cancel-modal">
                                <i class="bi bi-x-square"></i>
                            </button>
                        </div>
                        <div class="d-flex gap-2" v-if="(ConfigHolder.isUser || ConfigHolder.isProfessional) && (serviceRequest.isCancelled || serviceRequest.isCompleted)">
                            <button @click="handleServiceRequestClick(serviceRequest.reqid)" class="btn btn-dark service-request-review-btn" @click.stop data-bs-toggle="modal" data-bs-target="#service-request-review-modal">Review</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <!-- Service Request Info Modal -->
        <div class="modal fade" id="service-request-info-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Service Request Info</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="service-request-info-close-btn"></button>
                    </div>
                    <div class="modal-body" id="service-request-info-modal-body">
                        <p class="m-0"><span class="fw-bold">Service Request: </span>{{ currentServiceRequest?.serviceInfo?.name }}</p>
                        <p class="m-0"><span class="fw-bold">Request Status: </span>{{ currentServiceRequest?.status }}</p>
                        <p class="m-0"><span class="fw-bold">Request Status Info: </span>{{ currentServiceRequest?.statusInfo }}</p>
                        <p class="m-0"><span class="fw-bold">Requested At: </span>{{ new Date(Number(currentServiceRequest?.createdAt)) }}</p>
                        <p class="m-0"><span class="fw-bold">Request Closed At: </span>{{ currentServiceRequest?.closedAt ? new Date(Number(currentServiceRequest?.closedAt)) : "-" }}</p>
                        <template v-if="ConfigHolder.isAdmin || ConfigHolder.isUser">
                            <hr class="mt-2 mb-2" />
                            <p class="m-0 fw-bold">Professional Info:</p>
                            <p class="m-0"><span class="fw-bold">Name: </span>{{ currentServiceRequest?.professionalInfo?.name }}</p>
                            <p class="m-0"><span class="fw-bold">Email: </span>{{ currentServiceRequest?.professionalInfo?.email }}</p>
                            <p class="m-0"><span class="fw-bold">Role: </span>{{ currentServiceRequest?.professionalInfo?.role }}</p>
                            <p class="m-0"><span class="fw-bold">Status: </span>{{ currentServiceRequest?.professionalInfo?.status }}</p>
                            <p class="m-0"><span class="fw-bold">Location: </span>{{ currentServiceRequest?.professionalInfo?.location }}</p>
                            <p class="m-0"><span class="fw-bold">Pincode: </span>{{ currentServiceRequest?.professionalInfo?.pincode }}</p>
                            <p class="m-0"><span class="fw-bold">Description: </span>{{ currentServiceRequest?.professionalInfo?.description }}</p>
                            <p class="m-0"><span class="fw-bold">Price: </span>{{ currentServiceRequest?.professionalInfo?.price }} Rs</p>
                            <p class="m-0"><span class="fw-bold">Duration: </span>{{ currentServiceRequest?.professionalInfo?.duration }} Hrs</p>
                            <p class="m-0"><span class="fw-bold">Rating: </span>{{ currentServiceRequest?.professionalInfo?.rating }}</p>
                            <p class="m-0"><span class="fw-bold">Experience: </span>{{ currentServiceRequest?.professionalInfo?.experience }} Years</p>
                            <p class="m-0"><span class="fw-bold">Created At: </span>{{ new Date(Number(currentServiceRequest?.professionalInfo?.createdAt)) }}</p>
                        </template>
                        <template v-if="ConfigHolder.isAdmin || ConfigHolder.isProfessional">
                            <hr class="mt-2 mb-2" />
                            <p class="m-0 fw-bold">User Info:</p>
                            <p class="m-0"><span class="fw-bold">Name: </span>{{ currentServiceRequest?.userInfo?.name }}</p>
                            <p class="m-0"><span class="fw-bold">Email: </span>{{ currentServiceRequest?.userInfo?.email }}</p>
                            <p class="m-0"><span class="fw-bold">Role: </span>{{ currentServiceRequest?.userInfo?.role }}</p>
                            <p class="m-0"><span class="fw-bold">Status: </span>{{ currentServiceRequest?.userInfo?.status }}</p>
                            <p class="m-0"><span class="fw-bold">Location: </span>{{ currentServiceRequest?.userInfo?.location }}</p>
                            <p class="m-0"><span class="fw-bold">Pincode: </span>{{ currentServiceRequest?.userInfo?.pincode }}</p>
                            <p class="m-0"><span class="fw-bold">Created At: </span>{{ new Date(Number(currentServiceRequest?.userInfo?.createdAt)) }}</p>    
                        </template>
                        <hr class="mt-2 mb-2" />
                        <div>
                            <p class="m-0 fw-bold">Reviews:</p>
                            <div class="d-flex flex-column gap-1">
                                <div v-if="!currentServiceRequest?.reviews || currentServiceRequest?.reviews?.length === 0">No reviews for this Service Request yet!</div>
                                <div v-for="review in currentServiceRequest?.reviews" :key="review.id" class="d-flex gap-4 border rounded p-2">
                                    <div class="fs-1 align-self-center">
                                        <i class="bi bi-chat-square-text-fill"></i>
                                    </div>
                                    <div class="d-flex flex-column">
                                        <p class="m-0 fw-bold">{{ review.reviewerName }}({{ review.reviewerEmail }}) --> {{ review.revieweeName }}({{ review.revieweeEmail }}) | {{ review.type }}</p>
                                        <p class="m-0 small">{{ new Date(Number(review.createdAt)).toLocaleString() }}</p>
                                        <p class="m-0">{{ review.review }}</p>
                                        <p class="m-0"><span class="fw-bold">Rating: </span>{{ review.rating }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Service Request Accept Modal -->
        <div class="modal fade" id="service-request-accept-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">{{ ConfigHolder.isProfessional ? 'Accept Service Request' : 'Complete Service Request' }}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="service-request-accept-close-btn"></button>
                    </div>
                    <div class="modal-body" id="service-request-accept-modal-body">
                        <p class="m-0">Are you sure to <span class="fw-bold text-success">{{ ConfigHolder.isProfessional ? 'ACCEPT' : 'COMPLETE' }}</span> the service request? Click <span class="fw-bold text-success">Confirm</span> to proceed.</p>
                        <p class="m-0"><span class="fw-bold">Service Request: </span>{{ currentServiceRequest?.serviceInfo?.name }}</p>
                        <p class="m-0"><span class="fw-bold">Request Status: </span>{{ currentServiceRequest?.status }}</p>
                        <p class="m-0"><span class="fw-bold">Request Status Info: </span>{{ currentServiceRequest?.statusInfo }}</p>
                        <p class="m-0"><span class="fw-bold">Requested At: </span>{{ new Date(Number(currentServiceRequest?.createdAt)) }}</p>
                        <p class="m-0"><span class="fw-bold">Request Closed At: </span>{{ currentServiceRequest?.closedAt ? new Date(Number(currentServiceRequest?.closedAt)) : "-" }}</p>
                    </div>
                    <div class="modal-footer" id="service-request-accept-modal-footer">
                        <button type="button" class="btn btn-success" id="service-request-accept-btn" @click="handleAcceptServiceRequest">Confirm</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Service Request Cancel Modal -->
        <div class="modal fade" id="service-request-cancel-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Cancel Service Request</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="service-request-cancel-close-btn"></button>
                    </div>
                    <div class="modal-body" id="service-request-cancel-modal-body">
                        <p class="m-0">Are you sure to <span class="fw-bold text-danger">CANCEL</span> the service request? Click <span class="fw-bold text-danger">Cancel</span> to proceed.</p>
                        <p class="m-0"><span class="fw-bold">Service Request: </span>{{ currentServiceRequest?.serviceInfo?.name }}</p>
                        <p class="m-0"><span class="fw-bold">Request Status: </span>{{ currentServiceRequest?.status }}</p>
                        <p class="m-0"><span class="fw-bold">Request Status Info: </span>{{ currentServiceRequest?.statusInfo }}</p>
                        <p class="m-0"><span class="fw-bold">Requested At: </span>{{ new Date(Number(currentServiceRequest?.createdAt)) }}</p>
                        <p class="m-0"><span class="fw-bold">Request Closed At: </span>{{ currentServiceRequest?.closedAt ? new Date(Number(currentServiceRequest?.closedAt)) : "-" }}</p>
                    </div>
                    <div class="modal-footer" id="service-request-cancel-modal-footer">
                        <button type="button" class="btn btn-danger" id="service-request-cancel-btn" @click="handleCancelServiceRequest">Cancel</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Service Request Review Modal -->
        <div class="modal fade" id="service-request-review-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Service Request Review</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="service-request-review-close-btn"></button>
                    </div>
                    <div class="modal-body">
                        <div class="d-flex flex-column gap-2">
                            <div class="d-flex flex-column gap-2">
                                <textarea class="form-control" id="service-request-review-text" placeholder="Review Text" v-model="serviceRequestReviewText"></textarea>
                                <input class="form" type="number" id="service-request-review-rating" placeholder="Review Rating" v-model="serviceRequestReviewRating" />
                            </div>
                            <div id="service-request-review-modal-body">
                                <p class="mt-2">Add a service comment about the {{ ConfigHolder.isProfessional ? "user" : "professional" }} - <span class="fw-bold"> {{ getRevieweeInfo()?.name }} ({{ getRevieweeInfo()?.email }})</span></p>
                                <div class="d-flex flex-column gap-1">
                                    <div v-if="!currentServiceRequest?.reviews || currentServiceRequest?.reviews.length === 0">No reviews for this Service Request yet!</div>
                                    <div v-for="review in currentServiceRequest?.reviews" :key="review.revid" class="d-flex gap-4 border rounded p-2">
                                        <div class="fs-1 align-self-center">
                                            <i class="bi bi-chat-square-text-fill"></i>
                                        </div>
                                        <div class="d-flex flex-column">
                                            <p class="m-0 fw-bold">{{ review.reviewerName }}({{ review.reviewerEmail }}) --> {{ review.revieweeName }}({{ review.revieweeEmail }}) | {{ review.type }}</p>
                                            <p class="m-0 small">{{ new Date(Number(review.createdAt)).toLocaleString() }}</p>
                                            <p class="m-0">{{ review.review }}</p>
                                            <p class="m-0"><span class="fw-bold">Rating: </span>{{ review.rating }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer" id="service-request-review-modal-footer">
                        <button type="button" class="btn btn-dark" id="service-request-review-btn" @click="handlePostReview">Post</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>