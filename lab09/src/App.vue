<!-- <script setup>
import HelloWorld from './components/HelloWorld.vue'
</script> -->

<template>
  <div class="container py-4">
    <h1 class="mb-4">Unit List</h1>

    <!-- Controls row: search + rows-per-page -->
    <div class="row mb-3 align-items-end">
      <!-- Search box (Requirement 5) -->
      <div class="col-md-8">
        <label for="searchBox" class="form-label fw-semibold">Search</label>
        <input
          id="searchBox"
          v-model="searchQuery"
          @input="onSearchChange"
          type="text"
          class="form-control"
          placeholder="Search by code, description, credit points, or type…"
        />
      </div>

      <!-- Rows-per-page dropdown (Requirement 8) -->
      <div class="col-md-4">
        <label for="rowsPerPage" class="form-label fw-semibold">Rows per page</label>
        <select
          id="rowsPerPage"
          v-model="rowsPerPage"
          @change="onRowsPerPageChange"
          class="form-select"
        >
          <option :value="3">3</option>
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="filteredUnits.length">All</option>
        </select>
      </div>
    </div>

    <!-- Results summary -->
    <p class="text-muted small mb-2">
      Showing {{ pageStart }}–{{ pageEnd }} of {{ filteredUnits.length }} results
    </p>

    <!-- Data table (Requirements 3 & 4) -->
    <table class="table table-striped table-bordered table-hover align-middle">
      <thead class="table-dark">
        <tr>
          <th>#</th>
          <th>Unit Code</th>
          <th>Description</th>
          <th>Credit Points</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        <!-- Show message if no results -->
        <tr v-if="pagedUnits.length === 0">
          <td colspan="5" class="text-center text-muted fst-italic">No units found.</td>
        </tr>
        <!-- Render current page rows -->
        <tr v-for="(unit, index) in pagedUnits" :key="unit.code">
          <td>{{ pageStart + index }}</td>
          <td><span class="badge bg-secondary">{{ unit.code }}</span></td>
          <td>{{ unit.desc }}</td>
          <td>{{ unit.cp }}</td>
          <td>
            <span :class="typeBadgeClass(unit.type)">{{ unit.type }}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination (Requirement 6 & 7) -->
    <div class="d-flex justify-content-center mt-3">
      <paginate
        v-model="currentPage"
        :page-count="totalPages"
        :click-handler="onPageChange"
        :prev-text="'&laquo; Prev'"
        :next-text="'Next &raquo;'"
        :container-class="'pagination'"
        :page-class="'page-item'"
        :page-link-class="'page-link'"
        :prev-class="'page-item'"
        :prev-link-class="'page-link'"
        :next-class="'page-item'"
        :next-link-class="'page-link'"
        :active-class="'active'"
        :disabled-class="'disabled'"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import Paginate from 'vuejs-paginate-next'

export default defineComponent({
  name: 'App',

  components: { Paginate },

  setup() {
    // --- State ---
    const allUnits     = ref([])   // all units loaded from JSON
    const searchQuery  = ref('')   // current search string
    const currentPage  = ref(1)    // active page (1-indexed)
    const rowsPerPage  = ref(5)    // rows shown per page

    // --- Fetch data on mount (Requirement 3) ---
    onMounted(async () => {
      const response = await fetch('./units.json')
      allUnits.value = await response.json()
    })

    // --- Filtered list (Requirement 5 & 7) ---
    const filteredUnits = computed(() => {
      const q = searchQuery.value.trim().toLowerCase()
      if (!q) return allUnits.value
      return allUnits.value.filter(unit =>
        unit.code.toLowerCase().includes(q) ||
        unit.desc.toLowerCase().includes(q) ||
        unit.cp.toString().includes(q)      ||
        unit.type.toLowerCase().includes(q)
      )
    })

    // --- Pagination calculations ---
    const totalPages = computed(() =>
      Math.max(1, Math.ceil(filteredUnits.value.length / rowsPerPage.value))
    )

    const pageStart = computed(() =>
      filteredUnits.value.length === 0
        ? 0
        : (currentPage.value - 1) * rowsPerPage.value + 1
    )

    const pageEnd = computed(() =>
      Math.min(currentPage.value * rowsPerPage.value, filteredUnits.value.length)
    )

    // Slice of rows for the current page (Requirement 6)
    const pagedUnits = computed(() => {
      const start = (currentPage.value - 1) * rowsPerPage.value
      return filteredUnits.value.slice(start, start + rowsPerPage.value)
    })

    // --- Handlers ---
    // Reset to page 1 whenever the search query changes (Requirement 7)
    function onSearchChange() {
      currentPage.value = 1
    }

    // Reset to page 1 whenever rows-per-page changes (Requirement 8)
    function onRowsPerPageChange() {
      currentPage.value = 1
    }

    // Called by vuejs-paginate-next when user clicks a page button
    function onPageChange(page) {
      currentPage.value = page
    }

    // --- Badge colour helper ---
    function typeBadgeClass(type) {
      const map = {
        'Core':                 'badge bg-primary',
        'Software Development': 'badge bg-success',
        'Systems Analysis':     'badge bg-warning text-dark',
      }
      return map[type] ?? 'badge bg-secondary'
    }

    return {
      searchQuery,
      currentPage,
      rowsPerPage,
      filteredUnits,
      totalPages,
      pageStart,
      pageEnd,
      pagedUnits,
      onSearchChange,
      onRowsPerPageChange,
      onPageChange,
      typeBadgeClass,
    }
  }
})
</script>

<style scoped>
h1 {
  font-weight: 700;
  color: #2c3e50;
}
</style>