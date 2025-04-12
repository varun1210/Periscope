<script setup>
const props = defineProps({
  jobInfo: {
    type: Object,
    default: {},
  },
  //   jobTitle: {
  //     type: String,
  //     default: "No title",
  //   },
  //   company: {
  //     type: String,
  //     default: "No Company",
  //   },
  //   jobDescription: {
  //     type: String,
  //     default: "No Description",
  //   },
  //   location: {
  //     type: String,
  //     default: "No Location",
  //   },
  //   applyLink: {
  //     type: String,
  //     default: "https://google.com/",
  //   },
});

// const jobTitle = ref(props.jobInfo.jobTitle)
// const company = ref(props.jobInfo.company)
// const location = ref(props.jobInfo.location)
// const jobDescription = ref(props.jobInfo.description)
// const applyLink = ref(props.jobInfo.applyLink)
</script>

<template>
  <div class="header-company">
    <h1>{{ jobInfo.title }}</h1>
    <h2>{{ jobInfo.company }}</h2>
  </div>
  <div class="location-pay">
    <span>{{ jobInfo.location }}</span>
    <span>{{
      `${Math.floor(jobInfo.min_pay / 1000)}K - ${Math.floor(
        jobInfo.max_pay / 1000
      )}K`
    }}</span>
  </div>
  <div class="apply-link">
    <button><a :href="jobInfo.link">Apply</a></button>
  </div>
  <div class="job-description">
    <p>{{ jobInfo.job_description }}</p>
  </div>
</template>

<style scoped>
/* JobPosting Component Styles */
.header-company {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #edf2f7;
  padding-bottom: 1rem;
}

h1 {
  font-size: 1.8rem;
  color: #3b5998;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

h2 {
  font-size: 1.2rem;
  color: #4a5568;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.location-pay {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #edf2f7;
}

.location-pay span {
  display: inline-flex;
  align-items: center;
  color: #718096;
  font-size: 1rem;
}

.location-pay span:first-child::before {
  content: "📍";
  margin-right: 0.5rem;
  font-size: 1rem;
}

.location-pay span:last-child {
  background-color: rgba(59, 89, 152, 0.08);
  color: #3b5998;
  font-weight: 600;
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
}

.apply-link {
  margin-bottom: 2rem;
}

.apply-link button {
  background-color: #3b5998;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.apply-link button:hover {
  background-color: #4a66a0;
  box-shadow: 0 2px 8px rgba(59, 89, 152, 0.3);
  transform: translateY(-2px);
}

.apply-link a {
  color: white;
  text-decoration: none;
  display: block;
  width: 100%;
  height: 100%;
}

.job-description {
  line-height: 1.6;
}

.job-description p {
  color: #4a5568;
  white-space: pre-line;
  font-size: 1rem;
}

@media (max-width: 768px) {
  h1 {
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1.1rem;
  }

  .apply-link button {
    padding: 0.6rem 1.5rem;
  }
}
</style>
