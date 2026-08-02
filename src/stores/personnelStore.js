import { defineStore } from 'pinia';
import api from '@/services/api';

export const usePersonnelStore = defineStore('personnel', {
  state: () => ({
    personnels: [],
    selectedDepartment: 'All',
    loading: false,
    error: null
  }),
  getters: {
    filteredPersonnels(state) {
      if (!state.selectedDepartment || state.selectedDepartment === 'All') {
        return state.personnels;
      }
      return state.personnels.filter(p => p.departman === state.selectedDepartment);
    }
  },
  actions: {
    async fetchPersonnels() {
      this.loading = true;
      try {
        const response = await api.get('/Personnel/getPersonnel');
        this.personnels = response.data;
      } catch (err) {
        console.error('Error fetching personnel:', err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async addPersonnel(personnelData) {
      try {
        const response = await api.post('/Personnel/addPersonnel', personnelData);
        this.personnels.push(response.data);
      } catch (err) {
        console.error('Error adding personnel:', err);
        throw err;
      }
    },
    async updatePersonnel(id, personnelData) {
      try {
        const response = await api.put(`/Personnel/updatePersonnel/${id}`, personnelData);
        const index = this.personnels.findIndex(p => p.id === id);
        if (index !== -1) {
          this.personnels[index] = response.data;
        }
      } catch (err) {
        console.error('Error updating personnel:', err);
        throw err;
      }
    },
    async deletePersonnel(id) {
      try {
        await api.delete(`/Personnel/deletePersonnel/${id}`);
        this.personnels = this.personnels.filter(p => p.id !== id);
      } catch (err) {
        console.error('Error deleting personnel:', err);
      }
    }
  }
});