import { ref } from "vue";
import { defineStore } from "pinia";
import ConfigHolder from "../utils/config-holder";

export const useAppStore = defineStore('appStore', () => {
    const config = window.config || {};

    const availableRoutes = ["/", "/dashboard", "/services", "/servicerequests", "/reviews", "/adminpanel", "/account", "/account-blocked", "/professional-request-pending", "/professional-request-declined", "/professional-service-not-found"];

    const module = ref("dashboard");
    const availableServices = ref([]);
    const dashboardData = ref({});
    const reviews = ref(ConfigHolder.isAdmin ? {
        userReviews: [],
        professionalReviews: []
    } : []);
    const serviceProfessionals = ref([]);
    const serviceRequests = ref([]);
    const adminPanel = ref({});

    return { config, availableRoutes, module, availableServices, dashboardData, reviews, serviceProfessionals, serviceRequests, adminPanel };
});