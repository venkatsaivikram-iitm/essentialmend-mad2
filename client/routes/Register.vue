<script setup>
import { ref, onMounted } from 'vue';
import { redirect, showInfoMsg } from '../utils/common-utils';
import CryptoJS from 'crypto-js';
import { useAppStore } from '../stores/app-store';

const appStore = useAppStore();

const isSignUp = ref(false);
const isProfessionalSignUp = ref(false);
const registerTypeText = ref('Sign In Now');
const registerButtonText = ref('Sign In');
const registerSwitchButtonText = ref('New User? Sign Up');
const isPasswordVisible = ref(false);

const handleRegisterSwitch = () => {
  isSignUp.value = !isSignUp.value;
  if (isSignUp.value) {
    registerTypeText.value = 'Sign Up Now';
    registerButtonText.value = 'Sign Up';
    registerSwitchButtonText.value = 'Already a User? Sign In';
  } else {
    registerTypeText.value = 'Sign In Now';
    registerButtonText.value = 'Sign In';
    registerSwitchButtonText.value = 'New User? Sign Up';
  }
  isProfessionalSignUp.value = false;
  userType.value = 'user';
  name.value = '';
  email.value = '';
  password.value = '';
  location.value = '';
  pincode.value = '';
  serviceType.value = 'default';
  experience.value = '';
  description.value = '';
  duration.value = '';
  price.value = '';
};

const validateCredentials = (opts = {}) => {
  const { userType, name, email, password, service, experience, description, location, pincode, duration, price } = opts;
  let result = true;
  if (isSignUp.value) {
    if (location.length === 0 || pincode.length < 6) {
      result = false;
    } else if (userType === 'user' && !(
      regexMap.name.test(name) && 
      regexMap.email.test(email) &&
      regexMap.password.test(password)
    )) {
      result = false;
    } else if (userType === 'professional' && !(
      regexMap.name.test(name) && 
      regexMap.email.test(email) &&
      regexMap.password.test(password) &&
      appStore.availableServices.find((serviceType) => serviceType.sid === service) &&
      experience >= 0 &&
      description?.length > 0
    )) {
      result = false;
    } else if (userType === 'professional' && (duration <= 0 || price <= 0)) {
      result = false;
    }
  } else {
    if (!(regexMap.email.test(email) && regexMap.password.test(password))) {
      result = false;
    }
  }
  return result;
};

const regexMap = {
  email: /^[a-z0-9_.+-]+@[a-z0-9-]+\.[a-z]+$/,
  name: /^[a-zA-Z0-9. ]+$/,
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
};

const handleRegister = () => {
  const credentials = {
    email: email.value,
    password: password.value,
  };

  if (isSignUp.value) {
    Object.assign(credentials, {
      userType: isProfessionalSignUp.value ? 'professional' : 'user',
      name: name.value,
      location: location.value,
      pincode: pincode.value,
      service: serviceType.value,
      experience: experience.value,
      description: description.value,
      duration: duration.value,
      price: price.value
    });
  }

  if (validateCredentials(credentials)) {
    const url = isSignUp.value ? '/api/signup' : '/api/signin';
    const formData = new FormData();
    Object.keys(credentials).forEach(key => {
      formData.append(key, credentials[key]);
    });

    // Hash the password and update the formData
    const hashedPassword = CryptoJS.SHA256(password.value).toString();
    formData.set('password', hashedPassword);

    fetch(url, {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(response => {
      showInfoMsg(response.data.message, response.result);
      if (response.result === "success") {
        setTimeout(() => {
          redirect('/dashboard');
        }, 3000);
      }
    })
    .catch(error => {
      showInfoMsg("Invalid credentials", "error");
    });
  } else {
    showInfoMsg("Invalid credentials", "warning");
  }
};

const togglePasswordVisibility = () => {
  const passwordInput = document.getElementById('password');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    isPasswordVisible.value = true;
  } else {
    passwordInput.type = 'password';
    isPasswordVisible.value = false;
  }
};

const handleUserTypeChange = (event) => {
  isProfessionalSignUp.value = event.target.value === 'professional';
};

const userType = ref('user');
const name = ref('');
const email = ref('');
const password = ref('');
const location = ref('');
const pincode = ref('');
const serviceType = ref('default');
const experience = ref('');
const description = ref('');
const duration = ref('');
const price = ref('');

onMounted(() => {
  fetch('/api/services')
    .then(response => response.json())
    .then(response => {
      appStore.availableServices = response.data.services;
    })
    .catch(error => {
      showInfoMsg('Error fetching services:', "danger");
    });
});
</script>

<template>
  <main class="w-100 bg-white d-flex flex-column align-items-center justify-content-center" style="min-height: 100vh;">
    <article class="h-100 d-flex flex-column align-items-center justify-content-center">
      <header>
        <h1>
          <i class="bi bi-wrench-adjustable-circle"></i>
          <span>EssentialMend</span>
        </h1>
      </header>
      <article class="d-flex flex-column w-100 gap-2">
        <h2>{{ registerTypeText }}</h2>
        <section v-if="isSignUp">
          <select class="form-select" @change="handleUserTypeChange" v-model="userType">
            <option value="user">User</option>
            <option value="professional">Professional</option>
          </select>
        </section>
        <section class="d-flex flex-column w-100 gap-2">
          <input v-if="isSignUp" type="text" name="name" class="form-control" placeholder="Full Name" required v-model="name" />
          <input type="text" name="email" class="form-control" placeholder="Email" required v-model="email" />
          <div class="input-group position-relative">
            <input id="password" type="password" name="password" class="form-control has-validation" placeholder="Password" required v-model="password" />
            <i :class="isPasswordVisible ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'" @click="togglePasswordVisibility" class="position-absolute end-0 me-2 mt-2 z-index"></i>
          </div>
          <input v-if="isSignUp" type="text" name="location" class="form-control" placeholder="Location" required v-model="location" />
          <input v-if="isSignUp" type="number" name="pincode" class="form-control" placeholder="Pincode" maxlength="6" required v-model="pincode" />
          <select name="serviceType" class="form-select" v-if="isSignUp && isProfessionalSignUp" v-model="serviceType">
            <option value="default">Default</option>
            <option v-for="service in appStore.availableServices" :key="service.sid" :value="service.sid">{{ service.name }}</option>
          </select>
          <input v-if="isSignUp && isProfessionalSignUp" type="text" name="experience" class="form-control" placeholder="Experience" required v-model="experience" />
          <input v-if="isSignUp && isProfessionalSignUp" type="text" name="description" class="form-control" placeholder="Description" required v-model="description" />
          <input v-if="isSignUp && isProfessionalSignUp" type="text" name="duration" class="form-control" placeholder="Duration" required v-model="duration" />
          <input v-if="isSignUp && isProfessionalSignUp" type="text" name="price" class="form-control" placeholder="Price" required v-model="price" />
        </section>
        <section>
          <button class="btn btn-dark" @click="handleRegister">{{ registerButtonText }}</button>
        </section>
        <section>
          <button class="btn btn-dark" @click="handleRegisterSwitch">{{ registerSwitchButtonText }}</button>
        </section>
      </article>
    </article>
  </main>
</template>