<script setup>
import { RouterLink } from 'vue-router'

</script>

<template>
    <nav>
        <ul>
            <li><RouterLink class="nav-link" to="/home">Home</RouterLink></li>
            <li><RouterLink class="nav-link" to="/jobs">Jobs</RouterLink></li>
            <li><RouterLink class="nav-link" to="/profile">Profile</RouterLink></li>
        </ul>
    </nav>
</template>

<style scoped>
nav {
    background-color: #3b5998;
    background-image: linear-gradient(to right, #3b5998, #4a66a0);
    padding: 1rem 2rem;
    height: 3rem;
    box-shadow: 0 2px 10px rgba(44, 62, 80, 0.15);
    border-radius: 0 0 0.75rem 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-link {
    text-decoration: none;
    color: #ffffff;
    font-weight: 600;
    font-size: 1.1rem;
    padding: 0.5rem 1.25rem;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
    position: relative;
}

.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
}

.router-link-active {
    background-color: rgba(255, 255, 255, 0.2);
    position: relative;
}

.router-link-active::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 3px;
    background-color: #ffffff;
    border-radius: 3px;
}

ul {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5rem;
    padding: 0;
    margin: 0;
}

li {
    list-style: none;
}

@media (max-width: 768px) {
    ul {
        gap: 2rem;
    }
    
    .nav-link {
        padding: 0.5rem 1rem;
        font-size: 1rem;
    }
    
    nav {
        padding: 0.75rem 1rem;
    }
}
</style>
<!-- <style scoped>
nav {
    background-color: #4361ee;
    padding: 1rem 2rem;
    height: 2rem;
    box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1);
    border-radius: 0 0 0.5rem 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-link {
    text-decoration: none;
    color: #F8FAFF;
    font-weight: 600;
    font-size: 1.1rem;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    transition: all 0.3s ease;
}

.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-0.125rem);
}

.router-link-active {
    background-color: rgba(255, 255, 255, 0.25);
    border-bottom: 0.1875rem solid #F8FAFF;
}

ul {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5rem;
    padding: 0;
    margin: 0;
}

li {
    list-style: none;
}

@media (max-width: 48rem) { /* 768px */
    ul {
        gap: 2rem;
    }
}
</style>
 -->
