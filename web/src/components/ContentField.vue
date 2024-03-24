//每个页面内显示内容的白框，称为card
<template>
  <div class="container content-field">
    <div class="card">
      <div class="card-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>

</script>
<style scoped>
div.content-field{
  margin-top: 20px ;
}
</style>