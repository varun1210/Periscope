<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: String,
  company: String,
  jobLocation: String,
  jobPay: {
    type: String,
    default: "No Info"
  }
  // jobPay: String
});
</script>

<template>
    <div class="job-card-root">
        <h1>{{ title }}</h1>
        <h2>{{ company }}</h2>
        <div class="job-details">
            <span class="job-location">{{ jobLocation }}</span>
            <span class="job-pay">{{ jobPay }}</span>
        </div>
    </div>
</template>

<style scoped>
.job-card-root {
  border-radius: 0.75rem;
  padding: 1.5rem;
  background-color: white;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
  transition: all 0.3s ease;
  width: auto;
  max-width: 100%;
  max-height: 16rem;
  display: flex;
  flex-direction: column;
  border: 1px solid #edf2f7;
  border-bottom: 3px solid #edf2f7;
  box-sizing: border-box;
}

.job-card-root:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.1);
  border-bottom: 3px solid #3b5998;
}

h1 {
  color: #3b5998;
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 0.75rem;
}

h2 {
  color: #4a5568;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0.75rem;
}

.job-listings-panel .job-card-root h2 {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #64748b;
}

p {
  color: #4a5568;
  margin: 0.4rem 0;
  line-height: 1.4;
  text-align: justify;
}

p:first-of-type {
  margin-bottom: 0.75rem;
  flex-grow: 1;
  overflow: hidden;
  min-height: 0; /* Helps with flex containment */
}

.job-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #edf2f7;
}

.job-location {
  font-weight: 500;
  color: #718096;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.job-location::before {
  content: '📍';
  margin-right: 0.3rem;
  font-size: 0.9rem;
}

.job-pay {
  font-weight: 600;
  color: #3b5998;
  text-align: right;
  background-color: rgba(59, 89, 152, 0.08);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

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

/* Add a selected state for active job card */
.job-listings-panel .job-card-root.selected {
  background-color: rgba(59, 89, 152, 0.1);
  border-left: 4px solid #3b5998;
}
</style>


<!-- <style scoped>
.job-card-root {
  border-radius: 0.5rem;
  padding: 1.25rem;
  background-color: white;
  /* Stronger shadow on top and left */
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.15); 
  transition: all 0.3s ease;
  width: 24rem;
  max-height: 16rem; /* Made cards even taller */
  display: flex;
  flex-direction: column;
  border-right: 4px solid #d9d9d9;
  border-left: none;
}

.job-card-root:hover {
  transform: translateY(-0.25rem);
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2); /* Stronger neutral shadow on hover */
  border-color: #d9d9d9;
}

h1 {
  color: #001d91;
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

p {
  color: rgb(121, 121, 121);
  margin: 0.4rem 0;
  line-height: 1.4;
  text-align: justify; /* Added text justification */
}

p:first-of-type {
  margin-bottom: 0.75rem;
  flex-grow: 1;
  overflow: hidden;
}

/* Add this container for the location and pay */
.job-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto; /* Push to bottom */
}

.job-location {
  font-weight: 500;
  color: rgb(121, 121, 121);
}

.job-pay {
  font-weight: 600;
  color: #001d91;
  text-align: right;
}
</style> -->