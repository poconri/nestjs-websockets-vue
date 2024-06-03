<script setup lang="ts">
import MainHeader from '@/components/header/MainHeader.vue';
import Card from '@/components/card/CardBase.vue';
import { io } from 'socket.io-client';
import { onUnmounted, ref } from 'vue';
import { Person } from './types/person';

const socket = io('http://localhost:3000');

const ranking = ref<Person[]>([]);

const isConnected = ref(false);

socket.on('connect', () => {
  isConnected.value = true;
});

socket.on('disconnect', () => {
  isConnected.value = false;
});

socket.on('newScore', (data: Person) => {
  const currentRankingIds = ranking.value.map((score) => score.id);

  if (currentRankingIds.includes(data.id)) {
    ranking.value = ranking.value.map((score) =>
      score.id === data.id ? data : score,
    );
  } else {
    ranking.value = ranking.value.concat(data);
  }

  setTimeout(() => {
    ranking.value = ranking.value.sort((a, b) => b.points - a.points);
  }, 600);
});

socket.on('initialList', (data: Person[]) => {
  ranking.value = data;
});

onUnmounted(() => {
  socket.disconnect();
});
</script>

<template>
  <div class="bg-[black] p-4 w-screen min-h-screen h[100] flex flex-col">
    <main class=" flex-grow">
      <div class="bg-zinc-900 text-white rounded-lg p-8 shadow-lg">
        <MainHeader />
        <transition-group
          name="list"
          tag="div"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
        >
          <div v-for="person in ranking" :key="person.id" class="card-item">
            <Card :person="person" />
          </div>
        </transition-group>
      </div>
    </main>
    <footer
      class="bg-zinc-900 text-white text-center p-6 mt-4 rounded-lg shadow-inner flex justify-between items-center"
    >
      <span
        >Made with <span class="animate-pulse text-red-700"> ♥️ </span> by Ramon
        Pocón {{ new Date().getFullYear() }}</span
      >
      <span class="flex items-center">
        <span
          class="inline-block w-3 h-3 rounded-full mr-2"
          :class="isConnected ? 'bg-green-500' : 'bg-red-500'"
        ></span>
        WebSocket Status
      </span>
    </footer>
  </div>
</template>

<style scoped>
.card-item {
  @apply transition-transform duration-500 ease-in-out;
}
.list-enter-active,
.list-leave-active {
  @apply transition-opacity duration-500;
}
.list-enter-from,
.list-leave-to {
  @apply opacity-0;
}
.list-move {
  @apply transition-transform duration-500 ease-in-out;
}
</style>
