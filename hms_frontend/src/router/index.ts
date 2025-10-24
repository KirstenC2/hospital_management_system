import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/views/Dashboard.vue";
import Patients from "@/views/Patients.vue";
import Doctors from "@/views/Doctors.vue";
import Beds from "@/views/Beds.vue";
import MedicalRecords from "@/views/MedicalRecords.vue";
import SurgeryRooms from "@/views/SurgeryRooms.vue";
import Staffs from '@/views/Staffs.vue';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Dashboard",
      component: Dashboard,
    },
    {
      path: "/patients",
      name: "Patients",
      component: Patients,
    },
    {
      path: "/medical-records",
      name: "MedicalRecords",
      component: MedicalRecords,
    },
    {
      path: "/doctors",
      name: "Doctors",
      component: Doctors,
    },
    {
      path: "/staffs",
      name: "Staffs",
      component: Staffs,
    },
    {
      path: "/beds",
      name: "Beds",
      component: Beds
    },
    {

      path: "/surgery-rooms",
      name: "SurgeryRooms",
      component: SurgeryRooms

    }
    
  ],
});

export default router;