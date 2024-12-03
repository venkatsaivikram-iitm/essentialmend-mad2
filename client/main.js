import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import { createPinia } from 'pinia';
import App from './App.vue';
import "./main.css";


const pinia = createPinia();


const routes = [
  { path: '/', component: () => import("./routes/Home.vue") },
  { path: '/register', component: () => import("./routes/Register.vue") },
  { path: '/dashboard', component: () => import("./routes/Dashboard.vue") },
  { path: '/services', component: () => import("./routes/Services.vue") },
  { path: '/servicerequests', component: () => import("./routes/ServiceRequests.vue") },
  { path: '/reviews', component: () => import("./routes/Reviews.vue") },
  { path: '/adminpanel', component: () => import("./routes/AdminPanel.vue") },
  { path: '/account', component: () => import("./routes/Account.vue") },
  { path: '/account-blocked', component: () => import("./routes/AccountBlocked.vue") },
  { path: '/professional-request-pending', component: () => import("./routes/ProfessionalRequestPending.vue") },
  { path: '/professional-request-declined', component: () => import("./routes/ProfessionalRequestDeclined.vue") },
  { path: '/professional-service-not-found', component: () => import("./routes/ProfessionalServiceNotFound.vue") },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});


const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount('#body');