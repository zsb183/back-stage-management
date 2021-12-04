<template>
  <div id="app">
    <!-- <router-link to="/">Login登录</router-link> -->
    <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: 'app',
  components: {
    
  }
}
</script>

<style>
*{
  padding: 0;
  margin: 0;
  
}
#app{
  width: 100%;
  height: 100%;
}
html,body{
  width: 100%;
  height: 100%;
}
</style>
