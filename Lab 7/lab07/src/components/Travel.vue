<template>
  <div class="row mb-4">
    <div class="col-md-6 offset-md-3">
      <input type="text" v-model="searchQuery" class="form-control" placeholder="Search by name, country, description, or category...">
    </div>
  </div>

  <div class="row">
    <div class="col-12 col-md-6 col-lg-4 mb-4" v-for="dest in filteredDestinations" :key="dest.name">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">{{ dest.name }}</h5>
          <h6 class="card-subtitle mb-2 text-muted">{{ dest.country }} - {{ dest.category }}</h6>
          <p class="card-text">{{ dest.description }}</p>
          <img src="{{dest.image}}" alt="View" class="img-fluid rounded shadow">

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import destinationsData from '../assets/destinations.json';

const searchQuery = ref('');
const destinations = ref(destinationsData);

// Computed property to handle the search logic
const filteredDestinations = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return destinations.value.filter(dest => {
    return dest.name.toLowerCase().includes(query) ||
           dest.country.toLowerCase().includes(query) ||
           dest.description.toLowerCase().includes(query) ||
           dest.category.toLowerCase().includes(query);
  });
});
</script>