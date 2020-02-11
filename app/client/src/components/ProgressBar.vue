<template>
  <div>
    <div v-if="progressBar.half" class="row" >
      <div
        v-for="(val, ind) in progressBar.tags"
        :key="ind"
        class="col"
        :class="{
          'null-color': progress < 2 * ind,
          'half-full-color': progress === 2 * ind,
          'full-color': progress >= 2 * ind + 1
        }"
      >
        {{ val }}
      </div>
    </div>

    <div v-else class="row" >
      <div
        v-for="(val, ind) in progressBar.tags"
        :key="ind"
        class="col"
        :class="{
          'null-color': progress < ind,
          'full-color': progress >= ind
        }"
      >
        {{ val }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    progressBar: Object,
    progress: Number
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="stylus">

</style>
