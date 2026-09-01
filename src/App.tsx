import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Navigation/Sidebar';
import { Header } from './components/Common/Header';
import { AuthView } from './components/Auth/AuthView';
import { DashboardView } from './components/Dashboard/DashboardView';
import { TaskManagerView } from './components/Tasks/TaskManagerView';
import { CalendarView } from './components/Calendar/CalendarView';
import { FocusZoneView } from './components/FocusZone/FocusZoneView';
import { ProgressView } from './components/Progress/ProgressView';
import { RewardsView } from './components/Rewards/RewardsView';
import { ProfileView } from './components/Profile/ProfileView';
import { AddTaskModal } from './components/Tasks/AddTaskModal';
import { LevelUpModal } from './components/Common/LevelUpModal';
import { ToastContainer } from './components/Common/ToastContainer';
import { Task } from './types';

const MainLayout: React.FC = () => {
  const { currentTab, isAuthenticated } = useApp();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  if (!isAuthenticated) {
    return <AuthView />;
  }

  const handleOpenAddTask = () => {
    setTaskToEdit(null);
    setIsAddTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsAddTaskModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row antialiased">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileNavOpen} setMobileOpen={setMobileNavOpen} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenAddTask={handleOpenAddTask}
        />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView onOpenAddTask={handleOpenAddTask} />
          )}
          {currentTab === 'tasks' && (
            <TaskManagerView
              onOpenAddTask={handleOpenAddTask}
              onEditTask={handleEditTask}
            />
          )}
          {currentTab === 'calendar' && (
            <CalendarView onOpenAddTask={handleOpenAddTask} />
          )}
          {currentTab === 'focus' && <FocusZoneView />}
          {currentTab === 'progress' && <ProgressView />}
          {currentTab === 'rewards' && <RewardsView />}
          {currentTab === 'profile' && <ProfileView />}
        </main>
      </div>

      {/* Modals & Feedback Overlays */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        taskToEdit={taskToEdit}
      />
      <LevelUpModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
