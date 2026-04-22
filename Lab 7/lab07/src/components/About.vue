<template>
  <div class="row justify-content-center text-center">
    <div class="col-md-6">
      <p>This web application is designed to help users find and explore beautiful travel destinations around the world.</p>
      
      <h2 class="mt-4" v-if="firstName || lastName">Welcome {{ firstName }} {{ lastName }}!</h2>
      <h2 class="mt-4" v-else>Welcome!</h2>

      <p class="mt-3">What is your name?</p>

      <div class="mb-3">
        <label class="form-label">First Name</label>
        <input type="text" class="form-control" v-model="firstName">
      </div>
      <div class="mb-3">
        <label class="form-label">Last Name</label>
        <input type="text" class="form-control" v-model="lastName">
      </div>

      <div class="mb-4">
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="viewType" id="ocean" value="Ocean" v-model="selectedView">
          <label class="form-check-label" for="ocean">Ocean</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="viewType" id="mountain" value="Mountain" v-model="selectedView">
          <label class="form-check-label" for="mountain">Mountain</label>
        </div>
      </div>

      <img v-if="selectedView === 'Ocean'" src="/src/assets/bondi.jpg" alt="Ocean View" class="img-fluid rounded shadow">
      <img v-if="selectedView === 'Mountain'" src="/src/assets/mount fuji.jpg" alt="Mountain View" class="img-fluid rounded shadow">

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const firstName = ref('');
const lastName = ref('');
const selectedView = ref('Ocean'); // Default selection
</script>