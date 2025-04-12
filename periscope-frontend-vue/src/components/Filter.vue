<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  filterName: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['applyFilter']);

const filterMap = {
  Location: {
    options: ["Within 100", "Within 50", "Within 25"],
    default: "Location",
  },
  Seniority: {
    options: ["Early Career", "Mid Career", "Senior"],
    default: "Seniority",
  },
  Industry: {
    options: ["Healthcare", "Technology", "Finance", "Medical Equipment"],
    default: "Industry",
  },
};

// Add fallback for when filterName doesn't exist in filterMap
const filterOptionsObj = computed(() => filterMap[props.filterName] || {
  options: [],
  default: props.filterName,
});

const isOpen = ref(false);
const selected = ref([]);
const dropdownRef = ref(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const toggleOption = (option) => {
  const index = selected.value.indexOf(option);
  if (index === -1) {
    selected.value.push(option);
  } else {
    selected.value.splice(index, 1);
  }
};

const isSelected = (option) => {
  return selected.value.includes(option);
};

const displayText = computed(() => {
  if (selected.value.length === 0) {
    return filterOptionsObj.value.default;
  } else if (selected.value.length === 1) {
    return selected.value[0];
  } else {
    return `${selected.value.length} selected`;
  }
});

// emit("dev",)

const applyFilter = () => {
  emit('applyFilter', {
    filterName: props.filterName,
    selectedOptions: [...selected.value]
  });
  isOpen.value = false;
};

// Using Vue's vClickOutside directive
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
    selected.value.splice(0, selected.value.length);
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="multi-select-container" ref="dropdownRef">
    <button 
      class="multi-select-button" 
      @click="toggleDropdown"
      type="button"
    >
      <span>{{ displayText }}</span>
      <span class="arrow">▼</span>
    </button>
    
    <div class="multi-select-dropdown" v-if="isOpen">
      <div class="options-container">
        <label 
          v-for="option in filterOptionsObj.options" 
          :key="option"
          class="option-label"
        >
          <input 
            type="checkbox" 
            :value="option" 
            :checked="isSelected(option)"
            @change="toggleOption(option)"
          />
          <span class="option-text">{{ option }}</span>
        </label>
      </div>
      
      <div class="results-button-container">
        <button class="show-results-button" @click="applyFilter">
          Show Results
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.multi-select-container {
  position: relative;
  width: 100%;
  font-size: 0.9rem;
}

.multi-select-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.7em 1.2em;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  width: 100%;
  height: auto;
  color: #3b5998;
  font-weight: 500;
  background-color: white;
  box-shadow: 0 2px 6px rgba(44, 62, 80, 0.05);
  transition: all 0.3s ease;
  outline: none;
  cursor: pointer;
  text-align: left;
}

/* .multi-select-button:focus, */
/* .multi-select-button:hover {
  border-color: #3b5998;
  box-shadow: 0 2px 8px rgba(59, 89, 152, 0.2);
  transform: translateY(-2px);
} */

.arrow {
  font-size: 10px;
  color: #3b5998;
  transition: transform 0.2s ease;
}

.multi-select-container:hover .arrow {
  transform: translateY(2px);
}

.multi-select-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.12);
  z-index: 10;
  overflow: hidden;
}

.options-container {
  max-height: 200px;
  overflow-y: auto;
  padding: 8px 0;
}

.option-label {
  display: flex;
  align-items: center;
  padding: 0.7em 1.2em;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #4a5568;
}

.option-label:hover {
  background-color: #f1f5f9;
}

.option-text {
  margin-left: 10px;
  font-size: 0.95rem;
}

input[type="checkbox"] {
  cursor: pointer;
  accent-color: #3b5998;
  width: 16px;
  height: 16px;
}

.results-button-container {
  padding: 12px;
  border-top: 1px solid #edf2f7;
  background-color: #f8fafc;
}

.show-results-button {
  width: 100%;
  padding: 0.7em;
  background-color: #3b5998;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.show-results-button:hover {
  background-color: #4a66a0;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(59, 89, 152, 0.3);
}

/* Scrollbar styling */
.options-container::-webkit-scrollbar {
  width: 6px;
}

.options-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.options-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.options-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

<!-- <style scoped>
.multi-select-container {
  position: relative;
  width: 100%;
  font-size: 16px;
}

.multi-select-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8em 1.2em;
  border: 1px solid #ccc;
  border-radius: 2em;
  width: 100%;
  height: auto;
  color: #333;
  font-size: 16px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  outline: none;
  cursor: pointer;
  text-align: left;
}

.multi-select-button:focus,
.multi-select-button:hover {
  border-color: #001d91;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
}

.arrow {
  font-size: 12px;
  /* No animation */
}

.multi-select-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  overflow: hidden;
}

.options-container {
  max-height: 200px;
  overflow-y: auto;
  padding: 8px 0;
}

.option-label {
  display: flex;
  align-items: center;
  padding: 0.6em 1.2em;
  cursor: pointer;
  transition: background-color 0.2s;
}

.option-label:hover {
  background-color: #f5f5f5;
}

.option-text {
  margin-left: 8px;
}

input[type="checkbox"] {
  cursor: pointer;
}

.results-button-container {
  padding: 10px;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
}

.show-results-button {
  width: 100%;
  padding: 0.7em;
  background-color: #001d91;
  color: white;
  border: none;
  border-radius: 2em;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.show-results-button:hover {
  background-color: #001a7a;
}
</style> -->