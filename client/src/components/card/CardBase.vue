<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { defineProps } from 'vue';
import { Person } from '@/types/person';
import SeparatorBase from '../separator/SeparatorBase.vue';

const props = defineProps({
  person: {
    type: Object as () => Person,
    required: true,
  },
});

const animatedPerson = ref({ ...props.person });
const showContent = ref(true);

watch(
  () => props.person,
  async (newPerson) => {
    showContent.value = false;
    await nextTick();
    animatedPerson.value = { ...newPerson };
    showContent.value = true;
  },
);
</script>

<template>
  <article class="flex flex-col justify-center items-center">
    <SeparatorBase />
    <div class="grid grid-cols-[max-content_1fr] gap-4 items-center w-full">
      <Transition name="flip">
        <img
          v-show="showContent"
          :src="animatedPerson.avatarURL"
          alt="User Avatar"
          class="w-24 shrink-0 aspect-[3/2] rounded-lg shadow"
        />
      </Transition>
      <div class="flex flex-col">
        <p>
          <span class="text-zinc-500">Name: </span>
          <Transition name="flip">
            <b
              v-show="showContent"
              :key="animatedPerson.name"
              class="w-fit inline-block text-lg font-semibold"
            >
              {{ animatedPerson.name }}
            </b>
          </Transition>
        </p>
        <p>
          <span class="text-zinc-500">Points: </span>
          <Transition name="flip">
            <b
              v-show="showContent"
              :key="animatedPerson.points"
              class="inline-block text-sm text-gray-400"
            >
              {{ animatedPerson.points.toString().padStart(3, '0') }}
            </b>
          </Transition>
        </p>
      </div>
    </div>
  </article>
</template>

<style scoped>
.flip-enter-active {
  animation: flip-in 0.6s forwards;
}

.flip-leave-active {
  animation: flip-out 0.6s forwards;
}

@keyframes flip-in {
  0% {
    transform: rotateX(-90deg);
    opacity: 0;
  }
  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}

@keyframes flip-out {
  0% {
    transform: rotateX(0deg);
    opacity: 1;
  }
  100% {
    transform: rotateX(90deg);
    opacity: 0;
  }
}
</style>
