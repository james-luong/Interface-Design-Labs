<script setup>
import Task1 from './components/Task1.vue'
import Task2 from './components/Task2.vue'
</script>

<template>
  <div id="app">
    <nav style="margin-bottom: 20px; padding: 10px; background: #f0f0f0;">
      <router-link to="/task1" style="margin-right: 15px;">Task 1 (jQuery getJSON)</router-link>
      <router-link to="/task2">Task 2 (Fetch API)</router-link>
    </nav>

    <div style="padding: 20px;">
      <router-view></router-view>
    </div>
  </div>
</template>
