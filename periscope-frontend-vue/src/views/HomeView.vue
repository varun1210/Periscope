<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

import SearchBar from "@/components/home/SearchBar.vue";
import JobCard from "@/components/JobCard.vue";

//Request the data

const user = ref("Varun");

const previousJobs = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/userRecommendations"
    );
    previousJobs.value = response.data.recommended_jobs;
  } catch (error) {
    console.log(error);
  }
});

const handleJobClick = (id) => {
  console.log(`Job with ID ${id} was clicked!`);
};
</script>

<template>
  <!-- <Navbar /> -->
  <div class="homepage-root">
    <div class="hero-section">
      <h1>Welcome back, {{ user }}!</h1>
      <p>Get started with a search, or browse popular jobs!</p>
    </div>
    <div class="searchbar-div">
      <SearchBar width="50%" />
    </div>
    <div class="suggested-jobs-section">
      <div class="subsection"><h2>Previous Applied Jobs:</h2></div>
      <div class="suggest-grid-div">
        <ul class="suggest-grid">
          <li
            v-for="(job, index) in previousJobs"
            :key="job.recommendation_id"
          >
            <JobCard
              @click="handleJobClick(job.job.job_id)"
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
    </div>
  </div>
</template>

<style scoped>
.homepage-root {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: auto;
  color: #2c3e50;
  background-color: #f8fafc;
  max-width: 1400px;
  margin: 0 auto;
}

.hero-section {
  width: 95%;
  margin: 1.5rem 0.5rem;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e6f0fd 0%, #d4e6ff 100%);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(44, 62, 80, 0.06);
  border: 1px solid #e0e7ff;
}

h1 {
  margin-bottom: 8px;
  font-size: 2.5rem;
  font-weight: 700;
  color: #3b5998;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

p {
  margin-top: 4px;
  font-size: 1rem;
  font-weight: 500;
  color: #4a5568;
}

.searchbar-div {
  width: 95%;
  margin: 1.5rem 0;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.searchbar-div::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #3b5998, #8b9dc3);
  border-radius: 3px;
}

.suggested-jobs-section {
  width: 95%;
  margin: 1rem 0.5rem;
  padding: 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.subsection {
  width: 100%;
  padding: 0.5rem 1rem;
  margin: 0.5rem 0 1.5rem 0;
  text-align: start;
}

.subsection h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #3b5998;
  position: relative;
  display: inline-block;
  margin: 0;
}

.subsection h2:after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #3b5998, #8b9dc3);
  border-radius: 3px;
}

.suggest-grid-div {
  width: 100%;
  padding: 0;
  margin: 0.2rem 0;
  display: flex;
  text-align: center;
}

.suggest-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  align-items: start;
  justify-content: center;
  width: 100%;
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 1200px) {
  .suggest-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 800px) {
  .suggest-grid {
    grid-template-columns: 1fr;
  }

  .hero-section {
    padding: 1.5rem 1rem;
  }

  h1 {
    font-size: 2rem;
  }
}
</style>

<!-- <style scoped>
.homepage-root {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: auto;

  color: #001d91;
}

.hero-section {
  width: 95%;
  margin: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h1 {
  margin-bottom: 2px;
}

p {
  margin-top: 2px;
  font-size: small;
  font-weight: bold;
  color: rgb(121, 121, 121);
}

.searchbar-div {
  width: 95%;
  margin: 1em;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  /* height: 2rem; */
}

.suggested-jobs-section {
  width: 95%;
  margin: 0.5em;
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.subsection {
  width: 100%;
  padding: 0.5rem;
  margin: 0.2rem;
  text-align: start;
}

.suggest-grid-div {
  width: 100%;
  padding: 0.5rem;
  margin: 0.2rem;
  display: flex;
  text-align: center;
  /* align-items: center;
  justify-content: center; */
}

.suggest-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1em;
  align-items: center;
  justify-content: center;
}

li {
  list-style: none;
}
</style> -->
