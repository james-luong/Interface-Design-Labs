<template>
  <div class="row">
    <div class="col-12 text-center">
      <h1>Welcome to TravelApp</h1>
      <p>Discover your next great adventure with our curated list of world-class destinations.</p>
    </div>
  </div>

  <div class="row justify-content-center mt-4">
    <div class="col-md-8">
      <div id="travelCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="/src/assets/mount fuji.jpg" class="d-block w-100" alt="Mountain">
          </div>
          <div class="carousel-item">
            <img src="/src/assets/bondi.jpg" class="d-block w-100" alt="Beach">
          </div>
          <div class="carousel-item">
            <img src="/src/assets/nyc.jpg" class="d-block w-100" alt="City">
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#travelCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#travelCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  </div>
</template>