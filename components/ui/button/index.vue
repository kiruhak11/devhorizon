<template>
  <component
    :is="getComponent()"
    :class="['button', `button--${theme}`, { full }]"
    :to="to"
    ><slot></slot
  ></component>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import type { ButtonProps } from "./button.types";

const props = withDefaults(defineProps<ButtonProps>(), {
  theme: "primary",
});

const getComponent = () => {
  if (props.to) {
    return NuxtLink;
  }

  return "button";
};
</script>

<style lang="scss" scoped src="./button.styles.scss" />
