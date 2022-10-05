<template>
  <div class="mk-AppInputError">
    {{ props.error }}
  </div>
</template>

<script lang="ts" setup>
type Props = {
  error: string;
};

const props = defineProps<Props>();
</script>

<style lang="scss">
.mk-AppInputError {
    color: red;
}
</style>
