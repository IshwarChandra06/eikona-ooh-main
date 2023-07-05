<template>
<div>
  <div class="page-loader" v-if="loading">
<div class='container'>
  <div class='loader-container'>
    <img  :src="require(`@/assets/images/logo.png`)"  />
  </div>
</div>
  </div> 
</div>
</template>

<script>
  export default {
    data: () => {
      return {
        loading: false
      }
    },
    mounted() {
     
    },
     methods: {
      start() {
        this.loading = true
      },
      finish() {
        this.loading = false
      }
    }
  }
</script>

<style  scoped>
  .page-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  z-index: 999;
  overflow: hidden;
}
.loader-container{
  width: 50%;
  margin: auto;
  text-align: center;
}

.loader-container img {
  width: 50%;
      -webkit-animation:zoom 5s infinite;
    animation:zoom 5s infinite;
}
@keyframes loading {
  50% {
    width:50%;
    left: 50%;
    opacity: 1;
  }
  100% {
    width: 25%;
    left: 100%;
    opacity: 0;
  }
}
@-webkit-keyframes zoom{
    0%,100%{
       width:50%;
    }
    50%{
       width:25%;
    }
}
@keyframes zoom{
    0%, 100%{
       width:50%;
    }
    50%{
       width:25%;
    }
}
</style>