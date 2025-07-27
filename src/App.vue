<template>
  <div class="app-container">
    <header>
      <h1>X-Pay SDK Vue Example</h1>
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/payment-demo">Payment Demo</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>X-Pay SDK Integration Example &copy; 2023</p>
    </footer>
  </div>
</template>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  color: #333;
  background-color: #f5f5f5;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  margin-bottom: 30px;
  text-align: center;
}

h1 {
  color: #2c3e50;
}

nav {
  margin: 20px 0;
}

nav a {
  color: #42b983;
  text-decoration: none;
  margin: 0 10px;
  font-weight: bold;
}

nav a.router-link-active {
  color: #2c3e50;
}

main {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

footer {
  margin-top: 30px;
  text-align: center;
  color: #666;
  font-size: 0.9em;
}
</style>