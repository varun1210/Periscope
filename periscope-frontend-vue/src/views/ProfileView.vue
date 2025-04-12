<script setup>
import { ref, onMounted } from "vue";
// const profileDetails

const formDisabled = ref(true);
const userName = ref("");
const userEmail = ref("");
const userPhoneNumber = ref("");

const editButtonText = ref("Edit");

const fetchProfileData = () => {
  //have to implement
};

const toggleEditButton = () => {
  formDisabled.value = !formDisabled.value;
  if (editButtonText.value === "Edit") {
    editButtonText.value = "Cancel";
  } else {
    editButtonText.value = "Edit";
  }
};

onMounted(() => {
  //   document.addEventListener('click', handleClickOutside);
  fetchProfileData();
});
</script>

<template>
  <div class="profile-page-root">
    <div class="button-div">
      <button @click="toggleEditButton" class="edit-button">
        {{ editButtonText }}
      </button>
    </div>
    <div class="form-div">
      <form>
        <div class="label-div"><label for="name-input">Name</label></div>
        <input
          id="name-input"
          type="text"
          :disabled="formDisabled"
          :placeholder="userName"
        />
        <div class="label-div"><label for="email-input">Email</label></div>
        <input
          id="email-input"
          type="email"
          :disabled="formDisabled"
          :placeholder="userEmail"
        />
        <div class="label-div">
          <label for="phone-number-input">Phone Number</label>
        </div>
        <input
          id="phone-number-input"
          type="text"
          :disabled="formDisabled"
          :placeholder="userPhoneNumber"
        />
        <div class="label-div">
          <label for="resume-input">Resume Number</label>
        </div>
        <input
          id="resume-input"
          type="file"
          :disabled="formDisabled"
          :placeholder="userResume"
        />

        <button class="submit-button" type="submit" @click.prevent>
          Submit
        </button>
        <!-- <input id="resume-input"> -->
      </form>
    </div>
  </div>
</template>

<style>
.profile-page-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 80vh;
  background-color: #f8fafc;
}

.button-div {
  width: 100%;
  max-width: 700px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.edit-button {
  background-color: #3b5998;
  color: white;
  font-weight: 600;
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.edit-button:hover {
  background-color: #4a66a0;
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(59, 89, 152, 0.3);
}

.form-div {
  width: 100%;
  max-width: 700px;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
  border: 1px solid #edf2f7;
  padding: 2rem;
}

form {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  gap: 1.5rem;
}

.label-div {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 0.5rem;
}

label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.95rem;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  font-size: 1rem;
  color: #2c3e50;
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #3b5998;
  box-shadow: 0 0 0 3px rgba(59, 89, 152, 0.2);
}

input:disabled {
  background-color: #f1f5f9;
  color: #64748b;
  cursor: not-allowed;
}

input::placeholder {
  color: #94a3b8;
}

.submit-button {
  background-color: #3b5998;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  align-self: center;
  min-width: 150px;
}

.submit-button:hover {
  background-color: #4a66a0;
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(59, 89, 152, 0.3);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .profile-page-root {
    padding: 1rem;
  }

  .form-div {
    padding: 1.5rem;
  }

  .button-div,
  .form-div {
    width: 95%;
  }

  input,
  .submit-button {
    width: 100%;
  }
}
</style>
