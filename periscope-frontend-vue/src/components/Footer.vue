<script setup>
// No props or data needed for this simple footer
</script>

<template>
  <footer>
    <div class="footer-content">
      Periscope &copy; 2025
    </div>
  </footer>
</template>

<style scoped>
footer {
  background-color: #3b5998;
  background-image: linear-gradient(to right, #3b5998, #4a66a0);
  padding: 1.25rem 2rem;
  box-shadow: 0 -2px 10px rgba(44, 62, 80, 0.1);
  border-radius: 0.75rem 0.75rem 0 0;
  margin-top: 3rem;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  letter-spacing: 0.5px;
  position: relative;
}

.footer-content::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 3px;
}

@media (max-width: 768px) {
  footer {
    padding: 1rem;
  }
  
  .footer-content {
    font-size: 0.9rem;
  }
}
</style>

<!-- <style scoped>
footer {
  background-color: #4361ee;
  padding: 1rem 2rem;
  box-shadow: 0 -0.125rem 0.625rem rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem 0.5rem 0 0;
  margin-top: 2rem;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
}
</style> -->