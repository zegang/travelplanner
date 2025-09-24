import { defineStore } from 'pinia';
import type { Travel } from '@/lib/types/Travel';
import { travelsDemo } from './demoData';
import { ref, watch } from 'vue';
import axios from 'axios';

export default defineStore('travelStore', () => {
  const next_id = ref<number>(1);
  const pinia_db_name: string = 'pinia_db_travels';
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const travels = ref<Travel[]>([]);

  watch(travels, () => {
    localStorage.setItem(pinia_db_name, JSON.stringify(travels.value));
  }, { deep: true });

  const get_next_id = () => {
    let cur_id = next_id.value
    if (cur_id < travels.value.length) {
      cur_id = travels.value.length + 1;
    }
    next_id.value = cur_id + 1
    return cur_id
  }

  const fetchTravels = async () => {
    loading.value = true;
    error.value = null;

    try {
      await axios.get(
        'https://jsonplaceholder.typicode.com/photos?_limit=12000', // Mock API
        {
          timeout: 12000
        }
      );
    } catch (err) {
      error.value = 'Failed to fetch travels';
      console.error('Error fetching travels:', err);
    } finally {
      travels.value = travelsDemo;
      loading.value = false;
    }
  };

  const addTravel = (newTravel: Travel) => {
    newTravel.id = get_next_id();
    travels.value.push(newTravel);
  };

  const updateTravel = (id: number, updated: Partial<Travel>) => {
    const idx = travels.value.findIndex(l => l.id === id)
    if (idx !== -1) {
      travels.value[idx] = { ...travels.value[idx], ...updated }
    }
  };

  const deleteTravel = (id: number) => {
    travels.value = travels.value.filter(l => l.id !== id)
  };

  const init = () => {
    localStorage.removeItem(pinia_db_name);
    JSON.parse(localStorage.getItem(pinia_db_name) || '[]')
  };

  init();

  return {
    travels,
    loading,
    error,
    fetchTravels,
    addTravel,
    updateTravel,
    deleteTravel
  };
});
