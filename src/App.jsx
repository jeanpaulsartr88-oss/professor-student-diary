import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AuthScreen } from './components/AuthScreen';
import { JournalScreen } from './components/JournalScreen';
import { CabinetScreen } from './components/CabinetScreen';
import { GradebookScreen } from './components/GradebookScreen';
import { ProfessorJournalScreen } from './components/ProfessorJournalScreen';
import { ProfessorCabinetScreen } from './components/ProfessorCabinetScreen';
import { ProfessorGradebookScreen } from './components/ProfessorGradebookScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { setupBackButton, hideBackButton } from './utils/telegram';

const MainLayout = () => {
  const { currentUser, activeTab, setActiveTab } = useApp();

  // If user is not authenticated, show Auth / Registration screen
  if (!currentUser) {
    return <AuthScreen />;
  }

  const isProfessor = currentUser.role === 'professor';

  // Telegram BackButton integration
  useEffect(() => {
    if (activeTab !== 'journal') {
      setupBackButton(() => {
        setActiveTab('journal');
      });
    } else {
      hideBackButton();
    }
  }, [activeTab, setActiveTab]);

  const renderActiveScreen = () => {
    if (isProfessor) {
      switch (activeTab) {
        case 'journal':
          return <ProfessorJournalScreen />;
        case 'cabinet':
          return <ProfessorCabinetScreen />;
        case 'gradebook':
          return <ProfessorGradebookScreen />;
        case 'profile':
          return <ProfileScreen />;
        default:
          return <ProfessorJournalScreen />;
      }
    } else {
      switch (activeTab) {
        case 'journal':
          return <JournalScreen />;
        case 'cabinet':
          return <CabinetScreen />;
        case 'gradebook':
          return <GradebookScreen />;
        case 'profile':
          return <ProfileScreen />;
        default:
          return <JournalScreen />;
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#16161a] text-[#fffffe] overflow-hidden select-none">
      {/* Dark Academia Atmospheric Vignette */}
      <div className="vignette fixed inset-0 z-0 pointer-events-none" />

      {/* Top Header */}
      <Header />

      {/* Main Screen Container */}
      <main className="flex-1 overflow-hidden flex flex-col relative z-10">
        {renderActiveScreen()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
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
