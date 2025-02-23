<template>
  <label class="switch">
    <input v-model="isDark" type="checkbox" />
    <span class="slider">
      <span class="circle">
        <IconSun />
        <IconMoon />
      </span>
    </span>
  </label>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
</script>

<style scoped>
.switch {
  /* global */
  --total_transition_duration: 0.3s;
  /* switch */
  --slider_width: 2.875em;
  --slider_height: 1.5em;
  --slider_light_bg: var(--color-header-background);
  --slider_night_bg: var(--color-header-background);
  --slider_offset: calc((var(--slider_height) - var(--circle_diameter)) / 2);
  --slider_radius: calc(var(--slider_height) / 2);
  /* circle */
  --circle_diameter: 1.125em;
  --circle_rotation: 360deg;
  /* svg */
  --svg_width: var(--circle_diameter);
  --sun-color: var(--sun-color);
  --moon-color: var(--color-text);
}

.switch input {
  display: none;
}

.slider svg {
  position: absolute;
  height: auto;
  color: var(--svg-color);
  transition: var(--total_transition_duration) ease;
  width: 100%;
}

.circle svg.sun {
  transform: scale(1);
  color: var(--sun-color);
}

.circle svg.moon {
  transform: scale(0);
  color: var(--moon-color);
  width: calc(100% - 1px);
}

.slider {
  display: inline-block;
  width: var(--slider_width);
  height: var(--slider_height);
  box-shadow: 0 0px 12px var(--color-shadow);
  border-radius: var(--slider_radius);
  position: relative;
  cursor: pointer;
  transition: var(--total_transition_duration) ease;
  overflow: hidden;
}

.slider::before,
.slider::after {
  content: "";
  position: absolute;
  inset: 0;
  transition: var(--total_transition_duration) ease;
}

/* ::before and ::after backgrounds are needed for smooth 
transition of gradients otherwise there is no way :\ */
.slider::before {
  opacity: 0;
  background: var(--slider_night_bg);
}

.slider::after {
  opacity: 1;
  background: var(--slider_light_bg);
}

/* ------------ */

.circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--circle_diameter);
  height: var(--circle_diameter);
  position: absolute;
  top: var(--slider_offset);
  left: var(--slider_offset);
  transition: var(--total_transition_duration) ease;
  z-index: 10;
}

/* actions */

.switch input:checked + .slider::before {
  opacity: 1;
}

.switch input:checked + .slider::after {
  opacity: 0;
}

.switch input:active + .slider .circle {
  transform: scale(0.9);
}

.switch input:checked + .slider .circle {
  left: calc(100% - var(--circle_diameter) - var(--slider_offset));
}

.switch input:checked + .slider .sun {
  transform: scale(0) rotate(var(--circle_rotation));
}

.switch input:checked + .slider .moon {
  transform: scale(1) rotate(var(--circle_rotation));
}
</style>
