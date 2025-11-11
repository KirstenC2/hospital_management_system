import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/views/Dashboard.vue";
import Patients from "@/views/Patients.vue";
import Doctors from "@/views/Doctors.vue";
import Beds from "@/views/Beds.vue";
import MedicalRecords from "@/views/MedicalRecords.vue";
import SurgeryRooms from "@/views/SurgeryRooms.vue";

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
      path: '/patient/:id',
      name: 'PatientDetail',
      component: () => import('@/views/PatientDetails.vue'),
      props: true
    },
    {
      path: "/medical-records",
      name: "MedicalRecords",
      component: MedicalRecords,
    },
    {
      path: "/medical-records/:id",
      name: "MedicalRecordDetails",
      component: () => import('@/views/MedicalRecordsDetails.vue'),
      props: true
    },
    {
      path: "/doctors",
      name: "Doctors",
      component: Doctors,
    },
    {
      path: '/doctor/:id',
      name: 'DoctorDetail',
      component: () => import('@/views/DoctorDetails.vue'),
      props: true
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