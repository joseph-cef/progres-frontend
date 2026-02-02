import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import RequireAuth from './components/RequireAuth';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CardsPage from './pages/CardsPage';
import BacInfoPage from './pages/BacInfoPage';
import GroupsPage from './pages/GroupsPage';
import SubjectsPage from './pages/SubjectsPage';
import SchedulePage from './pages/SchedulePage';
import ExamGradesPage from './pages/ExamGradesPage';
import ExamSchedulePage from './pages/ExamSchedulePage';
import CCGradesPage from './pages/CCGradesPage';
import TranscriptsPage from './pages/TranscriptsPage';
import AccommodationPage from './pages/AccommodationPage';
import TransportPage from './pages/TransportPage';
import DischargePage from './pages/DischargePage';
import ProfilePage from './pages/ProfilePage';

 
export default function App() {
  return (
    <Routes>
       <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />
       <Route element={<RequireAuth />}>  
        <Route element={<DashboardLayout />}>
          <Route index element={<HomePage />} />
          <Route path="cards" element={<CardsPage />} />
          <Route path="bac-info" element={<BacInfoPage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="exam-grades" element={<ExamGradesPage />} />
          <Route path="exam-schedule" element={<ExamSchedulePage />} />
          <Route path="cc-grades" element={<CCGradesPage />} />
          <Route path="transcripts" element={<TranscriptsPage />} />
          <Route path="accommodation" element={<AccommodationPage />} />
          <Route path="transport" element={<TransportPage />} />
          <Route path="discharge" element={<DischargePage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>
       <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}