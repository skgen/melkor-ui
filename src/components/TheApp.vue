<template>
  <div class="mk-TheApp">
    <slot />
    <teleport to="body">
      <TheFloatingLayer />
    </teleport>
    <teleport to="body">
      <TheFullScreenLayer />
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import TheFullScreenLayer from '@src/components/layout/TheFullScreenLayer.vue';
import TheFloatingLayer from '@src/components/floating/TheFloatingLayer.vue';

</script>

<style lang="scss">
body[data-fs-modal="true"] {
    .mk-TheApp {
        filter: blur(1px);
    }
}
</style>
