<template>
  <div>
    <h2>Task 1: JsonPlaceholder Posts</h2>
    <ul style="list-style-type: none; padding: 0;">
      <li v-for="post in posts" :key="post.id" style="margin-bottom: 10px;">
        {{ post.id }} -- {{ post.title }}
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import $ from 'jquery'

  // Reactive reference to hold the fetched data
  const posts = ref([])

  onMounted(() => {
    // Use jQuery's getJSON method as required by the lab
    $.getJSON('https://jsonplaceholder.typicode.com/posts', (data) => {
      posts.value = data
    }).fail((error) => {
      console.error("Error fetching data with jQuery:", error)
    })
  })
</script>