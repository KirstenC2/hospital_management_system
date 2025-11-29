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
      path: "/appointments",
      name: "Appointments",
      component: () => import('@/views/Appointments.vue'),
    },
    {
      path: '/appointment/:id',
      name: 'AppointmentDetails',
      component: () => import('@/views/AppointmentDetails.vue'),
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
      path: '/bed-details/:id',
      name: 'BedDetail',
      component: () => import('@/views/BedDetails.vue'),
      props: true
    },
    {
      path: '/beds/new',
      name: 'CreateBed',
      component: () => import('@/components/CreateNewBedPage.vue')
    },
    {

      path: "/surgery-rooms",
      name: "SurgeryRooms",
      component: SurgeryRooms

    }
    
  ],
});

export default router;