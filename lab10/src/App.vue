<template>
  <div class="app">
    <!-- ── Header ── -->
    <header class="header">
      <div class="header-content">
        <span class="header-icon">✈️</span>
        <div>
          <h1>Travel Destinations</h1>
          <p>COS30043 Lab 10 — CRUD with MySQL</p>
        </div>
      </div>
    </header>

    <main class="container">

      <!-- ── Toolbar ── -->
      <div class="toolbar">
        <div class="search-group">
          <input
            v-model="search"
            @input="onSearch"
            type="text"
            placeholder="Search by name, country or description..."
            class="input search-input"
          />
          <select v-model="filterCategory" @change="fetchDestinations" class="input select">
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
        <button class="btn btn-primary" @click="openAdd">+ Add Destination</button>
      </div>

      <!-- ── Alert ── -->
      <transition name="fade">
        <div v-if="alert.message" :class="['alert', `alert-${alert.type}`]">
          {{ alert.message }}
          <button class="alert-close" @click="alert.message = ''">✕</button>
        </div>
      </transition>

      <!-- ── Table ── -->
      <div class="card">
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <span>Loading destinations…</span>
        </div>

        <div v-else-if="destinations.length === 0" class="empty">
          <span class="empty-icon">🗺️</span>
          <p>No destinations found.</p>
        </div>

        <div v-else class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Country</th>
                <th>Category</th>
                <th>Description</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="dest in destinations" :key="dest.id">
                <td class="id-cell">{{ dest.id }}</td>
                <td class="name-cell"><strong>{{ dest.name }}</strong></td>
                <td>{{ dest.country }}</td>
                <td>
                  <span :class="['badge', `badge-${dest.category.toLowerCase()}`]">
                    {{ dest.category }}
                  </span>
                </td>
                <td class="desc-cell">{{ dest.description }}</td>
                <td class="rating-cell">
                  <span class="stars">{{ starDisplay(dest.rating) }}</span>
                  <span class="rating-num">{{ Number(dest.rating).toFixed(1) }}</span>
                </td>
                <td class="actions-cell">
                  <button class="btn btn-sm btn-edit" @click="openEdit(dest)">Edit</button>
                  <button class="btn btn-sm btn-delete" @click="confirmDelete(dest)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ── Pagination ── -->
        <div v-if="pagination.totalPages > 1" class="pagination">
          <button class="page-btn" :disabled="pagination.page <= 1" @click="goToPage(1)">«</button>
          <button class="page-btn" :disabled="pagination.page <= 1" @click="goToPage(pagination.page - 1)">‹</button>
          <button
            v-for="p in pageNumbers" :key="p"
            :class="['page-btn', { active: p === pagination.page }]"
            @click="goToPage(p)"
          >{{ p }}</button>
          <button class="page-btn" :disabled="pagination.page >= pagination.totalPages" @click="goToPage(pagination.page + 1)">›</button>
          <button class="page-btn" :disabled="pagination.page >= pagination.totalPages" @click="goToPage(pagination.totalPages)">»</button>
          <span class="page-info">Page {{ pagination.page }} of {{ pagination.totalPages }} ({{ pagination.total }} records)</span>
        </div>
        <div v-else-if="!loading && destinations.length" class="pagination">
          <span class="page-info">{{ pagination.total }} record{{ pagination.total !== 1 ? 's' : '' }}</span>
        </div>
      </div>
    </main>

    <!-- ── Add / Edit Modal ── -->
    <transition name="modal">
      <div v-if="modal.show" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <h2>{{ modal.mode === 'add' ? 'Add New Destination' : 'Edit Destination' }}</h2>
            <button class="modal-close" @click="closeModal">✕</button>
          </div>
          <form @submit.prevent="submitForm" class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label>Name <span class="req">*</span></label>
                <input v-model="form.name" type="text" class="input" required placeholder="e.g. Bondi Beach" />
              </div>
              <div class="form-group">
                <label>Country <span class="req">*</span></label>
                <input v-model="form.country" type="text" class="input" required placeholder="e.g. Australia" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Category <span class="req">*</span></label>
                <select v-model="form.category" class="input" required>
                  <option value="" disabled>Select category</option>
                  <option>Beach</option>
                  <option>Mountain</option>
                  <option>City</option>
                  <option>Ocean</option>
                  <option>Nature</option>
                  <option>Other</option>
                </select>
              </div>
              <div class="form-group">
                <label>Rating (0–5) <span class="req">*</span></label>
                <input
                  v-model.number="form.rating"
                  type="number" class="input" required
                  min="0" max="5" step="0.1" placeholder="e.g. 4.8"
                />
              </div>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="form.description" class="input textarea" rows="3" placeholder="Brief description of the destination…"></textarea>
            </div>
            <div v-if="formError" class="form-error">{{ formError }}</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                {{ submitting ? 'Saving…' : (modal.mode === 'add' ? 'Add Destination' : 'Save Changes') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- ── Delete Confirm Modal ── -->
    <transition name="modal">
      <div v-if="deleteModal.show" class="modal-overlay" @click.self="deleteModal.show = false">
        <div class="modal modal-sm">
          <div class="modal-header">
            <h2>Confirm Delete</h2>
            <button class="modal-close" @click="deleteModal.show = false">✕</button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete <strong>{{ deleteModal.dest?.name }}</strong>?</p>
            <p class="delete-warn">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="deleteModal.show = false">Cancel</button>
            <button class="btn btn-delete" :disabled="submitting" @click="deleteDestination">
              {{ submitting ? 'Deleting…' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

interface Destination {
  id: number
  name: string
  country: string
  category: string
  description: string
  rating: number
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const API = '/api'

// ── State ──────────────────────────────────────────────────────────────────
const destinations   = ref<Destination[]>([])
const categories     = ref<string[]>([])
const loading        = ref(false)
const submitting     = ref(false)
const search         = ref('')
const filterCategory = ref('')
let   searchTimer: ReturnType<typeof setTimeout> | null = null

const pagination = reactive<Pagination>({ page: 1, limit: 5, total: 0, totalPages: 1 })

const alert = reactive({ message: '', type: 'success' })

const modal = reactive({ show: false, mode: 'add' as 'add' | 'edit' })
const form  = reactive({ id: null as number | null, name: '', country: '', category: '', description: '', rating: 0 })
const formError = ref('')

const deleteModal = reactive<{ show: boolean; dest: Destination | null }>({ show: false, dest: null })

// ── Page numbers ───────────────────────────────────────────────────────────
const pageNumbers = computed<number[]>(() => {
  const total = pagination.totalPages
  const cur   = pagination.page
  const pages = new Set<number>()
  for (let i = Math.max(1, cur - 2); i <= Math.min(total, cur + 2); i++) pages.add(i)
  return [...pages].sort((a, b) => a - b)
})

// ── Fetch destinations ────────────────────────────────────────────────────
async function fetchDestinations () {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page:     String(pagination.page),
      limit:    String(pagination.limit),
      search:   search.value,
      category: filterCategory.value
    })
    const res  = await fetch(`${API}/destinations?${params}`)
    const json = await res.json()
    if (!res.ok) throw new Error(json.error)
    destinations.value    = json.data
    pagination.total      = json.pagination.total
    pagination.totalPages = json.pagination.totalPages
    pagination.page       = json.pagination.page
  } catch (e: any) {
    showAlert(e.message || 'Failed to load destinations', 'error')
  } finally {
    loading.value = false
  }
}

async function fetchCategories () {
  try {
    const res  = await fetch(`${API}/categories`)
    const json = await res.json()
    categories.value = json
  } catch { /* non-critical */ }
}

onMounted(() => {
  fetchDestinations()
  fetchCategories()
})

// ── Pagination ────────────────────────────────────────────────────────────
function goToPage (p: number) {
  pagination.page = p
  fetchDestinations()
}

function onSearch () {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    pagination.page = 1
    fetchDestinations()
  }, 400)
}

// ── Modal helpers ─────────────────────────────────────────────────────────
function openAdd () {
  Object.assign(form, { id: null, name: '', country: '', category: '', description: '', rating: 4.5 })
  formError.value = ''
  modal.mode = 'add'
  modal.show = true
}

function openEdit (dest: Destination) {
  Object.assign(form, { ...dest })
  formError.value = ''
  modal.mode = 'edit'
  modal.show = true
}

function closeModal () { modal.show = false }

// ── Submit form ───────────────────────────────────────────────────────────
async function submitForm () {
  formError.value = ''
  if (form.rating < 0 || form.rating > 5) {
    formError.value = 'Rating must be between 0 and 5.'
    return
  }
  submitting.value = true
  try {
    const isEdit = modal.mode === 'edit'
    const url    = isEdit ? `${API}/destinations/${form.id}` : `${API}/destinations`
    const res    = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name, country: form.country,
        category: form.category, description: form.description, rating: form.rating
      })
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error)
    closeModal()
    showAlert(isEdit ? 'Destination updated!' : 'Destination added!', 'success')
    await fetchDestinations()
    await fetchCategories()
  } catch (e: any) {
    formError.value = e.message || 'Failed to save.'
  } finally {
    submitting.value = false
  }
}

// ── Delete ────────────────────────────────────────────────────────────────
function confirmDelete (dest: Destination) {
  deleteModal.dest = dest
  deleteModal.show = true
}

async function deleteDestination () {
  if (!deleteModal.dest) return
  submitting.value = true
  try {
    const res  = await fetch(`${API}/destinations/${deleteModal.dest.id}`, { method: 'DELETE' })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error)
    const name = deleteModal.dest.name
    deleteModal.show = false
    showAlert(`"${name}" deleted.`, 'success')
    if (destinations.value.length === 1 && pagination.page > 1) pagination.page--
    await fetchDestinations()
    await fetchCategories()
  } catch (e: any) {
    showAlert(e.message || 'Failed to delete.', 'error')
    deleteModal.show = false
  } finally {
    submitting.value = false
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────
function showAlert (message: string, type: 'success' | 'error' = 'success') {
  alert.message = message
  alert.type    = type
  setTimeout(() => { alert.message = '' }, 4000)
}

function starDisplay (rating: number): string {
  const r = Math.round(Number(rating))
  return '★'.repeat(r) + '☆'.repeat(5 - r)
}
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f0f4f8;
  color: #1a202c;
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #1a56db 0%, #0d3b8e 100%);
  color: #fff;
  padding: 1.25rem 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,.25);
}
.header-content { display: flex; align-items: center; gap: 1rem; max-width: 1200px; margin: 0 auto; }
.header-icon { font-size: 2.2rem; }
.header h1 { font-size: 1.6rem; font-weight: 700; }
.header p  { font-size: .85rem; opacity: .8; margin-top: .1rem; }

.container { max-width: 1200px; margin: 2rem auto; padding: 0 1.25rem; }

.toolbar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;
}
.search-group { display: flex; gap: .6rem; flex: 1; flex-wrap: wrap; }
.search-input { flex: 1; min-width: 200px; }

.input {
  width: 100%; padding: .5rem .8rem;
  border: 1.5px solid #cbd5e0; border-radius: 8px;
  font-size: .95rem; background: #fff; transition: border-color .2s; outline: none;
}
.input:focus { border-color: #1a56db; box-shadow: 0 0 0 3px rgba(26,86,219,.15); }
.select { width: auto; min-width: 160px; cursor: pointer; }
.textarea { resize: vertical; font-family: inherit; }

.btn {
  display: inline-flex; align-items: center; gap: .4rem;
  padding: .55rem 1.2rem; border: none; border-radius: 8px;
  font-size: .9rem; font-weight: 600; cursor: pointer;
  transition: filter .15s, transform .1s; white-space: nowrap;
}
.btn:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
.btn:active:not(:disabled) { transform: translateY(0); }
.btn:disabled { opacity: .55; cursor: not-allowed; }
.btn-primary   { background: #1a56db; color: #fff; }
.btn-secondary { background: #e2e8f0; color: #2d3748; }
.btn-edit      { background: #ecc94b; color: #744210; }
.btn-delete    { background: #e53e3e; color: #fff; }
.btn-sm { padding: .35rem .75rem; font-size: .82rem; border-radius: 6px; }

.alert {
  display: flex; align-items: center; justify-content: space-between;
  padding: .75rem 1rem; border-radius: 8px; margin-bottom: 1rem;
  font-size: .9rem; font-weight: 500;
}
.alert-success { background: #c6f6d5; color: #276749; }
.alert-error   { background: #fed7d7; color: #822727; }
.alert-close { background: none; border: none; cursor: pointer; font-size: 1rem; opacity: .7; }
.alert-close:hover { opacity: 1; }

.card { background: #fff; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,.1); overflow: hidden; }

.loading, .empty {
  display: flex; flex-direction: column; align-items: center;
  gap: .75rem; padding: 3rem 1rem; color: #718096;
}
.spinner {
  width: 36px; height: 36px; border: 3px solid #e2e8f0;
  border-top-color: #1a56db; border-radius: 50%;
  animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.empty-icon { font-size: 2.5rem; }

.table-wrapper { overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; font-size: .9rem; }
.table th {
  background: #ebf4ff; color: #2b4c8c; font-weight: 700;
  text-align: left; padding: .75rem 1rem;
  border-bottom: 2px solid #bee3f8; white-space: nowrap;
}
.table td { padding: .7rem 1rem; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
.table tbody tr:last-child td { border-bottom: none; }
.table tbody tr:hover { background: #f7faff; }
.id-cell   { color: #a0aec0; width: 48px; }
.name-cell { min-width: 130px; }
.desc-cell { max-width: 280px; color: #4a5568; font-size: .85rem; }
.actions-cell { white-space: nowrap; display: flex; gap: .4rem; }
.rating-cell  { white-space: nowrap; }
.stars { color: #ecc94b; letter-spacing: 1px; font-size: .85rem; }
.rating-num { font-weight: 700; font-size: .85rem; margin-left: .3rem; color: #2d3748; }

.badge { display: inline-block; padding: .2rem .6rem; border-radius: 20px; font-size: .78rem; font-weight: 600; }
.badge-beach    { background: #fefcbf; color: #744210; }
.badge-mountain { background: #e2e8f0; color: #2d3748; }
.badge-city     { background: #bee3f8; color: #2b6cb0; }
.badge-ocean    { background: #b2f5ea; color: #234e52; }
.badge-nature   { background: #c6f6d5; color: #276749; }
.badge-other    { background: #fed7d7; color: #822727; }

.pagination {
  display: flex; align-items: center; justify-content: center;
  gap: .35rem; padding: 1rem; flex-wrap: wrap;
}
.page-btn {
  min-width: 36px; height: 36px; padding: 0 .6rem;
  border: 1.5px solid #e2e8f0; background: #fff; border-radius: 8px;
  cursor: pointer; font-size: .9rem; font-weight: 600; color: #4a5568; transition: all .15s;
}
.page-btn:hover:not(:disabled):not(.active) { border-color: #1a56db; color: #1a56db; }
.page-btn.active { background: #1a56db; border-color: #1a56db; color: #fff; }
.page-btn:disabled { opacity: .4; cursor: not-allowed; }
.page-info { font-size: .85rem; color: #718096; margin-left: .5rem; }

.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem;
}
.modal {
  background: #fff; border-radius: 14px; width: 100%; max-width: 560px;
  box-shadow: 0 20px 60px rgba(0,0,0,.25); overflow: hidden;
}
.modal-sm { max-width: 380px; }
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.1rem 1.5rem; border-bottom: 1px solid #e2e8f0; background: #f7faff;
}
.modal-header h2 { font-size: 1.1rem; color: #1a202c; }
.modal-close { background: none; border: none; cursor: pointer; font-size: 1.1rem; color: #718096; padding: .2rem .4rem; border-radius: 4px; }
.modal-close:hover { background: #e2e8f0; color: #1a202c; }
.modal-body { padding: 1.5rem; }
.modal-footer {
  display: flex; justify-content: flex-end; gap: .75rem;
  padding: 1rem 1.5rem; border-top: 1px solid #e2e8f0; background: #f7faff;
}

.form-row { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
.form-row .form-group { flex: 1; min-width: 140px; }
.form-group { margin-bottom: 1rem; }
.form-group:last-child { margin-bottom: 0; }
.form-group label { display: block; font-size: .85rem; font-weight: 600; color: #4a5568; margin-bottom: .35rem; }
.req { color: #e53e3e; }
.form-error  { color: #e53e3e; font-size: .85rem; margin-top: .5rem; font-weight: 500; }
.delete-warn { color: #c53030; font-size: .85rem; margin-top: .4rem; }

.fade-enter-active, .fade-leave-active { transition: opacity .3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.modal-enter-active, .modal-leave-active { transition: opacity .25s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal, .modal-leave-active .modal { transition: transform .25s; }
.modal-enter-from .modal { transform: translateY(-20px) scale(.96); }
.modal-leave-to .modal { transform: translateY(20px) scale(.96); }
</style>
