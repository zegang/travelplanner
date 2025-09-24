import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import axios from 'axios';
import type { TravelLocation } from '@/lib/types/TravelLocation'

export const useLocationStore = defineStore('locationStore', () => {
  // Define a reactive state for locations
  const global_locations_id = ref<number>(1)
  const pinia_db_name: string = 'pinia_db_locations';
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const get_next_location_id = () => {
    const next_id = global_locations_id.value
    global_locations_id.value = global_locations_id.value + 1
    return next_id
  }

  // Get locations from LocalStorage or default to static data
  const defLocations: TravelLocation[] = [
    {
      id: get_next_location_id(),
      title: 'Eiffel Tower',
      date: 'Oct 26, 2025',
      duration: '2 hours',
      description: 'An iconic symbol of Paris and France, the Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars.',
      notes: 'Book tickets online to skip the long queues. Go up to the top level for a fantastic view.',
      images: ['https://placehold.co/600x400/3f51b5/ffffff?text=Eiffel+Tower'],
      weblinks: [{ label: 'Official Website', url: 'https://www.toureiffel.paris/en' }],
      coordinates: { lat: 48.8584, lng: 2.2945 },
      baiduCoordinates: null
    },
    {
      id: get_next_location_id(),
      title: 'The Louvre Museum',
      date: 'Oct 27, 2025',
      duration: '4 hours',
      description: 'Home to thousands of works of art, including the Mona Lisa. The Louvre is the world’s most-visited museum.',
      notes: 'The museum is massive. Plan your visit in advance and focus on the exhibits you really want to see.',
      images: ['https://placehold.co/600x400/e91e63/ffffff?text=Louvre+Museum'],
      weblinks: [{ label: 'Official Website', url: 'https://www.louvre.fr/en' }],
      coordinates: { lat: 48.8606, lng: 2.3376 },
      baiduCoordinates: null
    },
    {
      id: get_next_location_id(),
      title: 'Catacombs of Paris',
      date: 'Oct 28, 2025',
      duration: '1.5 hours',
      description: 'A subterranean ossuary holding the remains of more than six million people in a small part of the old limestone quarries that are a part of a tunnel network built to consolidate Paris\'s ancient cemeteries.',
      notes: 'The line is always very long. You must book a timed-entry ticket in advance. The tour can be a bit claustrophobic.',
      images: ['https://placehold.co/600x400/4CAF50/ffffff?text=Paris+Catacombs'],
      weblinks: [{ label: 'Official Website', url: 'https://www.catacombes.paris/en' }],
      coordinates: { lat: 48.8340, lng: 2.3323 },
      baiduCoordinates: null
    },
    {
      id: get_next_location_id(),
      title: 'Notre-Dame de Paris',
      date: 'Oct 29, 2025',
      duration: '1 hour',
      description: 'A medieval Catholic cathedral on the Île de la Cité in the 4th arrondissement of Paris. The cathedral is renowned for its size, antiquity, and architectural interest.',
      notes: 'Currently undergoing reconstruction after the 2019 fire. Can only be viewed from the outside.',
      images: ['https://placehold.co/600x400/FFC107/ffffff?text=Notre-Dame'],
      weblinks: [{ label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Notre-Dame_de_Paris' }],
      coordinates: { lat: 48.8530, lng: 2.3499 },
      baiduCoordinates: null
    },
  ]

  const locations = ref<TravelLocation[]>(
    JSON.parse(localStorage.getItem(pinia_db_name) || '[]') ||
    defLocations);

  // Watch for changes to the locations array and update LocalStorage
  watch(locations, () => {
    localStorage.setItem(pinia_db_name, JSON.stringify(locations.value));
  }, { deep: true });

  // Fetch locations from a simulated API endpoint (could be your own API or mock API)
  const fetchLocations = async () => {
    loading.value = true;
    error.value = null;

    try {
      // Simulate fetching data from an API (or use your own API URL here)
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/photos?_limit=5', // Mock API
        {
          timeout: 3000
        });
      // Map the response data to match your location model
      // locations.value = response.data.map((item: any) => ({
      //   id: item.id,
      //   title: item.title,
      //   date: new Date().toISOString(),
      //   description: 'A beautiful location from the API.',
      //   images: [ item.url ],
      // }));

    } catch (err) {
      error.value = 'Failed to fetch locations';
      console.error('Error fetching locations:', err);
    } finally {
      locations.value = defLocations;
      loading.value = false;
      // Save locations to LocalStorage
      localStorage.setItem(pinia_db_name, JSON.stringify(locations.value));
    }
  };

  // Add a new location
  const addLocation = (newLocation: TravelLocation) => {
    newLocation.id = get_next_location_id()
    locations.value.push(newLocation);
    localStorage.setItem(pinia_db_name, JSON.stringify(locations.value));
  };

  const updateLocation = (id: number, updated: Partial<TravelLocation>) => {
    const idx = locations.value.findIndex(l => l.id === id)
    if (idx !== -1) {
      locations.value[idx] = { ...locations.value[idx], ...updated }
    }
  }

  const deleteLocation = (id: number) => {
    locations.value = locations.value.filter(l => l.id !== id)
    localStorage.setItem(pinia_db_name, JSON.stringify(locations.value));
  }

  // Check if locations are already saved in LocalStorage
  const loadLocationsFromLocalStorage = () => {
    loading.value = true;
    localStorage.removeItem(pinia_db_name);
    localStorage.clear();
    const savedLocations = JSON.parse(localStorage.getItem(pinia_db_name) || '[]');
    if (savedLocations.length) {
      locations.value = savedLocations;
    } else {
      fetchLocations();
    }
    loading.value = false;
  };

  // Load locations from LocalStorage when the store is initialized
  loadLocationsFromLocalStorage();

  return {
    locations,
    loading,
    error,
    fetchLocations,
    addLocation,
    updateLocation,
    deleteLocation
  };
});
