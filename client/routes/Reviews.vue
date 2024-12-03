<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAppStore } from '../stores/app-store';
import ConfigHolder from '../utils/config-holder';

const appStore = useAppStore();
const loading = ref(true);
const isAdmin = ConfigHolder.userInfo.isAdmin;

const sortValue = ref('default');

const filteredReviews = computed(() => {
  if (sortValue.value === 'default') {
    return appStore.reviews;
  }
  const ratingThreshold = parseInt(sortValue.value);
  if (ConfigHolder.isAdmin) {
    return {
      userReviews: appStore.reviews.userReviews.filter(review => review.rating <= ratingThreshold),
      professionalReviews: appStore.reviews.professionalReviews.filter(review => review.rating <= ratingThreshold)
    };
  }
  return appStore.reviews.filter(review => review.rating <= ratingThreshold);
});

onMounted(() => {
  fetch('/api/review')
    .then(response => response.json())
    .then(response => {
      if (response.result === "success") {
        appStore.reviews = response.data.reviews;
      } else {
        console.error('Failed to fetch reviews:', response.message);
      }
    })
    .catch(error => {
      console.error('Failed to fetch reviews:', error);
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>

<template>
  <section class="flex-grow-1 d-flex flex-column h-100 p-2 bg-white rounded-start">
    <section class="d-flex align-items-center">
      <div class="input-group mr-sm-2 flex-grow-1" id="service-search-wrapper">
        <h2>Reviews</h2>
      </div>
      <select class="form-select" id="reviews-sort" aria-label="Sort" v-model="sortValue">
        <option value="default" selected>Default</option>
        <option value="1"><= 1</option>
        <option value="2"><= 2</option>
        <option value="3"><= 3</option>
        <option value="4"><= 4</option>
      </select>
    </section>
    <hr />
    <div v-if="loading">Loading...</div>
    <div v-else class="flex-grow-1 overflow-scroll">
      <template v-if="isAdmin">
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <button class="nav-link active text-black" id="nav-user-reviews-tab" data-bs-toggle="tab" data-bs-target="#nav-user-reviews-panel" type="button" role="tab" aria-controls="nav-user-reviews-panel" aria-selected="true">User Reviews</button>
            <button class="nav-link text-black" id="nav-professional-reviews-tab" data-bs-toggle="tab" data-bs-target="#nav-professional-reviews-panel" type="button" role="tab" aria-controls="nav-professional-reviews-panel" aria-selected="false">Professional Reviews</button>
          </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
          <div class="tab-pane fade show active" id="nav-user-reviews-panel" role="tabpanel" aria-labelledby="nav-user-reviews-tab">
            <div v-if="filteredReviews.userReviews.length === 0">No user reviews available.</div>
            <div v-else class="d-flex flex-column gap-1" id="user-reviews">
              <div v-for="review in filteredReviews.userReviews" :key="review.id" class="d-flex gap-4 border rounded p-2">
                <div class="fs-1 align-self-center">
                  <i class="bi bi-chat-square-text-fill"></i>
                </div>
                <div class="d-flex flex-column">
                  <p class="m-0 fw-bold">{{ review.reviewerName }}({{ review.reviewerEmail }}) --> {{ review.revieweeName }}({{ review.revieweeEmail }}) | {{ review.type }}</p>
                  <p class="m-0 small">{{ new Date(review.createdAt).toLocaleString() }}</p>
                  <p class="m-0">{{ review.review }}</p>
                  <p class="m-0"><span class="fw-bold">Rating: </span>{{ review.rating }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="nav-professional-reviews-panel" role="tabpanel" aria-labelledby="nav-professional-reviews-tab">
            <div v-if="filteredReviews.professionalReviews.length === 0">No professional reviews available.</div>
            <div v-else class="d-flex flex-column gap-1" id="professional-reviews">
              <div v-for="review in filteredReviews.professionalReviews" :key="review.id" class="d-flex gap-4 border rounded p-2">
                <div class="fs-1 align-self-center">
                  <i class="bi bi-chat-square-text-fill"></i>
                </div>
                <div class="d-flex flex-column">
                  <p class="m-0 fw-bold">{{ review.reviewerName }}({{ review.reviewerEmail }}) --> {{ review.revieweeName }}({{ review.revieweeEmail }}) | {{ review.type }}</p>
                  <p class="m-0 small">{{ new Date(review.createdAt).toLocaleString() }}</p>
                  <p class="m-0">{{ review.review }}</p>
                  <p class="m-0"><span class="fw-bold">Rating: </span>{{ review.rating }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="d-flex flex-column gap-1" id="reviews">
          <div v-if="filteredReviews.length === 0">No reviews available.</div>
          <div v-for="review in filteredReviews" :key="review.id" class="d-flex gap-4 border rounded p-2">
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
      </template>
    </div>
  </section>
</template>
