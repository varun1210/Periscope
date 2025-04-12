<script setup>
import SearchBar from "@/components/home/SearchBar.vue";
import Filter from "@/components/Filter.vue";
import JobCard from "@/components/JobCard.vue";
import JobPosting from "@/components/JobPosting.vue";
import JP from "../data2";
import { ref, computed, onMounted, onUpdated, useTemplateRef } from "vue";

import axios from "axios";

// const jobPostings = ref(JP);
const jobPostings = ref([{"job": {}}]);

const pageNumber = ref(0);
const totalPages = ref(10); // Set this dynamically based on your data

// const selectedJobIndex = ref(2)
const selectedJob = ref(jobPostings.value[0].job);
const scroll = useTemplateRef('scroll-div-ref')

const startPage = computed(() => {
  // For first few pages, start at page 1
  if (pageNumber.value <= 1) return 0;

  // For pages near the end, show last 3 pages
  if (pageNumber.value >= totalPages.value - 2) return totalPages.value - 3;

  // Otherwise center the current page
  return pageNumber.value - 1;
});

onMounted(async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/userRecommendations"
    );
    jobPostings.value = response.data.recommended_jobs;
    selectedJob.value = jobPostings.value[0].job;
  } catch (error) {
    console.log(error);
  }
});

onUpdated(() => {
  scroll.value.scrollTo(0, 0)

})

const changeJobSelection = (jobId) => {
  let recommended_job = jobPostings.value.find((posting) => posting.job.job_id === jobId);
  selectedJob.value = recommended_job.job
};

// Function to update the current page
const updatePageNumber = (newPage) => {
  pageNumber.value = newPage;
  // Here you would also fetch new data for the updated page
};
</script>

<template>
  <div class="job-page-root">
    <div class="filters-section">
      <div class="filter-div" id="search-bar">
        <SearchBar width="100%" />
      </div>
      <div class="filter-div">
        <Filter
          @apply-filter="console.log('location filter applied')"
          filterName="Location"
        />
      </div>
      <div class="filter-div">
        <Filter
          @apply-filter="console.log('seniority filter applied')"
          filterName="Seniority"
        />
      </div>
      <div class="filter-div">
        <Filter
          @applyFilter="console.log('industry filter applied')"
          filterName="Industry"
        />
      </div>
    </div>
    <div class="job-view-section">
      <div class="job-listings-panel">
        <ul>
          <li v-for="job in jobPostings" :key="job.job.job_id">
            <JobCard
              @click="changeJobSelection(job.job.job_id)"
              :title="job.job.title"
              :company="job.job.company"
              :jobLocation="job.job.location"
              :jobPay="`${Math.floor(job.job.min_pay / 1000)}K - ${Math.floor(
                job.job.max_pay / 1000
              )}K`"
            />
          </li>
        </ul>
      </div>
      <div class="full-job-div" ref="scroll-div-ref">
        <JobPosting :jobInfo="selectedJob" />
      </div>
    </div>
    <div class="pagination">
      <!-- Previous page button -->
      <button
        v-if="pageNumber > 0"
        @click="updatePageNumber(pageNumber - 1)"
        class="pagination-button"
      >
        &lt; Prev
      </button>

      <!-- First page button (if not visible in current range) -->
      <button
        v-if="pageNumber > 1"
        @click="updatePageNumber(0)"
        class="pagination-button"
      >
        1
      </button>

      <!-- Ellipsis if there's a gap -->
      <span v-if="pageNumber > 2" class="pagination-ellipsis">...</span>

      <!-- Page number buttons -->
      <button
        v-for="n in Math.min(3, totalPages)"
        :key="n"
        @click="updatePageNumber(startPage + n - 1)"
        :class="[
          'pagination-button',
          startPage + n - 1 === pageNumber ? 'active' : '',
        ]"
      >
        {{ startPage + n }}
      </button>

      <!-- Ellipsis if there's a gap -->
      <span v-if="pageNumber < totalPages - 3" class="pagination-ellipsis"
        >...</span
      >

      <!-- Last page button (if not visible in current range) -->
      <button
        v-if="pageNumber < totalPages - 2"
        @click="updatePageNumber(totalPages - 1)"
        class="pagination-button"
      >
        {{ totalPages }}
      </button>

      <!-- Next page button -->
      <button
        v-if="pageNumber < totalPages - 1"
        @click="updatePageNumber(pageNumber + 1)"
        class="pagination-button"
      >
        Next &gt;
      </button>
    </div>
  </div>
</template>

<style>
/* Main container styling */
.job-page-root {
  height: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #f8fafc;
  max-width: 1400px;
  margin: 0 auto;
}

/* Filters section styling */
.filters-section {
  width: 95%;
  margin: 1rem 0.5rem 2rem 0.5rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
  border: 1px solid #edf2f7;
  flex-wrap: wrap;
}

.filter-div {
  height: 3rem;
  margin: 0.25rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

#search-bar {
  flex: 2;
  min-width: 300px;
}

.filter-div:not(#search-bar) {
  flex: 1;
  min-width: 180px;
  max-width: 220px;
}

/* Job view section styling */
.job-view-section {
  width: 95%;
  min-height: 500px;
  padding: 0;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
  border: 1px solid #edf2f7;
  overflow: hidden;
}

/* Job listings panel styling */
.job-listings-panel {
  width: 35%;
  border-right: 1px solid #edf2f7;
  height: 100%;
  overflow-y: auto;
  max-height: 700px;
  background-color: #f8fafc;
}

.job-listings-panel ul {
  padding: 0;
  margin: 0;
}

.job-listings-panel li {
  list-style: none;
  padding: 0;
  margin: 0;
  border-bottom: 1px solid #edf2f7;
}

.job-listings-panel li:last-child {
  border-bottom: none;
}

/* JobCard styles for the list view */
.job-listings-panel .job-card-root {
  border-radius: 0;
  border: none;
  box-shadow: none;
  transition: background-color 0.2s ease;
  max-height: none;
  height: auto;
  cursor: pointer;
}

.job-listings-panel .job-card-root:hover {
  background-color: #edf2f7;
  transform: none;
  border-bottom: none;
}

.job-listings-panel .job-card-root h1 {
  font-size: 1.1rem;
  margin-bottom: 0.4rem;
}

.job-listings-panel .job-card-root p {
  margin-bottom: 0.5rem;
  max-height: 2.8em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  text-overflow: ellipsis;
  text-align: left;
}

.job-listings-panel .job-details {
  border-top: none;
  padding-top: 0.5rem;
}

/* Selected state for active job card */
.job-listings-panel .job-card-root.selected {
  background-color: rgba(59, 89, 152, 0.1);
  border-left: 4px solid #3b5998;
}

/* Full job details panel styling */
.full-job-div {
  width: 65%;
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
  max-height: 700px;
}

.pagination {
  margin: 2rem 0 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.pagination-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0 0.75rem;
  background-color: white;
  color: #3b5998;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.pagination-button:hover {
  background-color: #edf2f7;
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(44, 62, 80, 0.1);
}

.pagination-button.active {
  background-color: #3b5998;
  color: white;
  border-color: #3b5998;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Style for prev/next buttons */
.pagination-button:first-child,
.pagination-button:last-child {
  padding: 0 1rem;
  font-weight: 500;
}

.pagination-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  color: #718096;
  font-weight: bold;
  letter-spacing: 1px;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .filters-section {
    flex-direction: column;
    height: auto;
    padding: 1rem;
    gap: 1rem;
  }

  .filter-div,
  #search-bar {
    width: 100%;
    max-width: 100%;
  }

  .job-view-section {
    flex-direction: column;
    height: auto;
  }

  .job-listings-panel,
  .full-job-div {
    width: 100%;
    max-height: none;
  }

  .job-listings-panel {
    border-right: none;
    border-bottom: 1px solid #edf2f7;
    max-height: 400px;
  }
}

@media (max-width: 768px) {
  .job-page-root {
    padding: 1rem;
  }

  .filters-section,
  .job-view-section {
    width: 100%;
    margin: 0.5rem 0;
  }

  .pagination {
    gap: 0.25rem;
  }

  .pagination-button {
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.5rem;
    font-size: 0.85rem;
  }

  .pagination-button:first-child,
  .pagination-button:last-child {
    padding: 0 0.75rem;
  }

  .pagination-ellipsis {
    min-width: 1.5rem;
  }
}
</style>

<!-- <style>
.job-page-root {
  border: 1px solid red;
  height: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.filters-section {
  border: 1px solid red;
  width: 95%;
  height: 2.5rem;
  margin: 0.5rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.8rem;
}

.filter-div {
  border: 1px solid green;
  height: 90%;
  width: 16rem;
  margin: 0.5em;
  padding: 0.5em;
  display: flex;
  align-items: center;
  justify-content: center;
}

#search-bar {
  width: 32rem;
}

.job-view-section {
  border: 1px solid red;
  width: 95%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> -->
