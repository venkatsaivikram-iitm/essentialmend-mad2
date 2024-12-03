<script setup>
import ConfigHolder from '../utils/config-holder.js';
import { onMounted, ref } from 'vue';
import { useAppStore } from '../stores/app-store.js';
import { showInfoMsg } from "../utils/common-utils.js";

const appStore = useAppStore();
const chart1 = ref(null);
const chart2 = ref(null);
const chart3 = ref(null);
const chart4 = ref(null);

const mountCharts = () => {
    const chartData = {
        chart1: {
            labels: appStore.dashboardData.serviceRequests.map((r) => r[0]),
            data: appStore.dashboardData.serviceRequests.map((r) => r[1]),
        },
        ...(ConfigHolder.isAdmin ? {
            chart2: {
              labels: appStore.dashboardData.professionals.map((r) => r[0]),
              data: appStore.dashboardData.professionals.map((r) => r[1]),
            },
            chart3: {
              labels: appStore.dashboardData.professionalRatings.map((r) => r[0]),
              data: appStore.dashboardData.professionalRatings.map((r) => r[1]),
            },
            chart4: {
              labels: appStore.dashboardData.professionalReviews.map((r) => r[0]),
              data: appStore.dashboardData.professionalReviews.map((r) => r[1]),
            }
          } : {
            chart2: {
              labels: appStore.dashboardData.reviews.map((r) => r[0]),
              data: appStore.dashboardData.reviews.map((r) => r[1]),
            }
          }
        )
    }
    
    new Chart(chart1.value, {
      type: 'bar',
      data: {
        labels: chartData.chart1.labels,
        datasets: [{
          label: 'Service Request Status',
          data: chartData.chart1.data,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    new Chart(chart2.value, {
        type: 'bar',
        data: {
            labels: chartData.chart2.labels,
            datasets: [{
              label: ConfigHolder.isAdmin ? 'Professional Status' : 'Reviews Rating',
              data: chartData.chart2.data,
              borderWidth: 1
            }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      if (ConfigHolder.isAdmin) {
        new Chart(chart3.value, {
          type: 'bar',
          data: {
              labels: chartData.chart3.labels,
              datasets: [{
                label: 'Professionals Rating',
                data: chartData.chart3.data,
                borderWidth: 1
              }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
        new Chart(chart4.value, {
          type: 'bar',
          data: {
              labels: chartData.chart4.labels,
              datasets: [{
                label: 'Professionals Reviews',
                data: chartData.chart4.data,
                borderWidth: 1
              }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
};

onMounted(() => {
    fetch('/api/dashboarddata')
        .then(response => response.json())
        .then(response => {
            appStore.dashboardData = response.data.dashboardData;
            mountCharts();
        })
        .catch(error => {
            showInfoMsg('Failed to fetch dashboard data:', "danger");
        });
});
</script>

<template>
    <section class="dashboard-main-wrapper bg-white rounded-start d-flex flex-column p-3 w-100 h-100 gap-4 overflow-scroll text-white">
        <div class="d-flex w-100 flex-grow-1 gap-4">
            <div class="h-100 flex-grow-1 bg-black rounded overflow-auto">
                <canvas id="chart1" ref="chart1" class="w-100 h-100 p-2"></canvas>
            </div>
            <div class="h-100 flex-grow-1 bg-black rounded">
                <canvas id="chart2" ref="chart2" class="w-100 h-100 p-2"></canvas>
            </div>
        </div>
        <div class="d-flex w-100 flex-grow-1 gap-4">
            <div v-if="ConfigHolder.isUser || ConfigHolder.isProfessional" class="h-100 flex-grow-1 bg-black rounded p-2">
                <p class="fw-bold text-decoration-underline">Current Service Request</p>
                <div v-if="appStore.dashboardData.currentServiceRequest">
                    <div v-if="ConfigHolder.isUser">
                        <p class="m-0"><span class="fw-bold">Professional: </span>{{ appStore.dashboardData.currentServiceRequest.professionalInfo?.name || '-' }}</p>
                        <p class="m-0"><span class="fw-bold">Professional Email: </span>{{ appStore.dashboardData.currentServiceRequest.professionalInfo?.email || '-' }}</p>
                    </div>
                    <div v-if="ConfigHolder.isProfessional">
                        <p class="m-0"><span class="fw-bold">User: </span>{{ appStore.dashboardData.currentServiceRequest.userInfo?.name || '-' }}</p>
                        <p class="m-0"><span class="fw-bold">User Email: </span>{{ appStore.dashboardData.currentServiceRequest.userInfo?.email || '-' }}</p>
                    </div>
                    <p class="m-0"><span class="fw-bold">Service: </span>{{ appStore.dashboardData.currentServiceRequest.serviceInfo?.name || '-' }}</p>
                    <p class="m-0"><span class="fw-bold">Status: </span>{{ appStore.dashboardData.currentServiceRequest.status }}</p>
                    <p class="m-0"><span class="fw-bold">Status Info: </span>{{ appStore.dashboardData.currentServiceRequest.statusInfo }}</p>
                    <p class="m-0"><span class="fw-bold">Price: </span>{{ appStore.dashboardData.currentServiceRequest.professionalInfo?.price || '-' }} Rs</p>
                    <p class="m-0"><span class="fw-bold">Created At: </span>{{ new Date(appStore.dashboardData.currentServiceRequest.createdAt).toLocaleString() }}</p>
                </div>
                <div v-else>
                    <p>No current Service Request on going!!</p>
                </div>
            </div>
            <div v-else class="h-100 flex-grow-1 bg-black rounded">
                <canvas id="chart3" ref="chart3" class="w-100 h-100 p-2"></canvas>
            </div>
            <div v-if="ConfigHolder.isUser || ConfigHolder.isProfessional" class="h-100 flex-grow-1 bg-black rounded p-2">
                <p class="fw-bold text-decoration-underline">Last Service Request</p>
                <div v-if="appStore.dashboardData.lastServiceRequest">
                    <div v-if="ConfigHolder.isUser">
                        <p class="m-0"><span class="fw-bold">Professional: </span>{{ appStore.dashboardData.lastServiceRequest.professionalInfo?.name || '-' }}</p>
                        <p class="m-0"><span class="fw-bold">Professional Email: </span>{{ appStore.dashboardData.lastServiceRequest.professionalInfo?.email || '-' }}</p>
                    </div>
                    <div v-if="ConfigHolder.isProfessional">
                        <p class="m-0"><span class="fw-bold">User: </span>{{ appStore.dashboardData.lastServiceRequest.userInfo?.name || '-' }}</p>
                        <p class="m-0"><span class="fw-bold">User Email: </span>{{ appStore.dashboardData.lastServiceRequest.userInfo?.email || '-' }}</p>
                    </div>
                    <p class="m-0"><span class="fw-bold">Service: </span>{{ appStore.dashboardData.lastServiceRequest.serviceInfo?.name || '-' }}</p>
                    <p class="m-0"><span class="fw-bold">Status: </span>{{ appStore.dashboardData.lastServiceRequest.status }}</p>
                    <p class="m-0"><span class="fw-bold">Status Info: </span>{{ appStore.dashboardData.lastServiceRequest.statusInfo }}</p>
                    <p class="m-0"><span class="fw-bold">Price: </span>{{ appStore.dashboardData.lastServiceRequest.professionalInfo?.price || '-' }} Rs</p>
                    <p class="m-0"><span class="fw-bold">Created At: </span>{{ new Date(appStore.dashboardData.lastServiceRequest.createdAt).toLocaleString() }}</p>
                    <p class="m-0"><span class="fw-bold">Closed At: </span>{{ new Date(appStore.dashboardData.lastServiceRequest.closedAt).toLocaleString() }}</p>
                </div>
                <div v-else>
                    <p>No Last Service Request yet!!</p>
                </div>
            </div>
            <div v-else class="h-100 flex-grow-1 bg-black rounded">
                <canvas id="chart4" ref="chart4" class="w-100 h-100 p-2"></canvas>
            </div>
        </div>
    </section>
</template>