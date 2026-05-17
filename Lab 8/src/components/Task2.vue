<template>
  <div>
    <h2>Task 2: Units</h2>
    <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; max-width: 800px;">
      <thead>
        <tr style="background-color: #f9f9f9; text-align: left;">
          <th>Code</th>
          <th>Description</th>
          <th>cp</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="unit in units" :key="unit.code">
          <td>{{ unit.code }}</td>
          <td>{{ unit.desc }}</td>
          <td>{{ unit.cp }}</td>
          <td>{{ unit.type }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'

  const units = ref([])

  onMounted(() => {
    // Use the native Fetch API to retrieve the local JSON file
    
    fetch('/cos30043/s104070337/lab08/units.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok')
        return response.json()
      })
      .then(data => {
        units.value = data
      })
      .catch(error => {
        console.error("Error fetching units:", error)
      })
  })
</script>