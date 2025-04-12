<script setup>
import { ref } from "vue";

const searchBarText = ref("");

const performSearch = () => {
  // search functionality to be implemented.
  console.log(searchBarText.value);
};

const props = defineProps({
  width: {
    type: String,
    default: "100%"
  }
});

const widthStyle = `width: ${props.width}`
</script>

<template>
  <input
    :style="widthStyle"
    type="text"
    v-model="searchBarText"
    @keyup.enter="performSearch"
    placeholder="Search jobs..."
  />
</template>

<style scoped>
input {
  padding: 0.8em 1.2em;
  border: 1px solid #ccc;
  border-radius: 2em;
  /* width: 50%; */
  height: auto;
  color: #333;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  outline: none;
}

input:focus {
  border-color: #001d91;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
}
</style>
