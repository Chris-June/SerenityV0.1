import { ChatProvider } from '@/context/ChatContext';
import { ChatInterface } from '@/components/ChatInterface';
import { LandingPage } from '@/components/LandingPage';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { FeatureModal } from '@/components/FeatureModal';
import { useState, useEffect } from 'react';
import { initializeKnowledgeBase } from '@/services/knowledge-base';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { JournalPage } from '@/pages/JournalPage';
import { InsightsPage } from '@/pages/InsightsPage';
import { ExercisesPage } from '@/pages/ExercisesPage';
import { ResourcesPage } from '@/pages/ResourcesPage';
import { WellnessPage } from '@/pages/WellnessPage';
import { BreathingExercise } from '@/components/exercises/BreathingExercise';
import { GuidedMeditation } from '@/components/exercises/GuidedMeditation';
import { GratitudePractice } from '@/components/exercises/GratitudePractice';
import { MoodLifting } from '@/components/exercises/MoodLifting';
import { CopingStrategies } from '@/components/CopingStrategies';

function App() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Initialize knowledge base when app starts
    initializeKnowledgeBase().catch(console.error);
  }, []);

  if (!started) {
    return (
      <div className="flex flex-col min-h-screen">
        <LandingPage onStart={() => setStarted(true)} />
        <Footer />
      </div>
    );
  }

  return (
    <Router>
      <ChatProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex-1 bg-gradient-to-b from-background to-muted">
            <Routes>
              <Route path="/" element={
                <main className="max-w-6xl mx-auto p-4 md:p-8">
                  <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                    Mental Health Companion
                  </h1>
                  <div className="max-w-2xl mx-auto">
                    <ChatInterface />
                  </div>
                </main>
              } />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/exercises" element={<ExercisesPage />} />
              <Route path="/exercises/breathing" element={<BreathingExercise />} />
              <Route path="/exercises/meditation" element={<GuidedMeditation />} />
              <Route path="/exercises/gratitude" element={<GratitudePractice />} />
              <Route path="/exercises/mood" element={<MoodLifting />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/resources/coping" element={<CopingStrategies />} />
              <Route path="/wellness" element={<WellnessPage />} />
              <Route path="/mood" element={<Navigate to="/wellness?tab=mood" replace />} />
              <Route path="/breathing" element={<Navigate to="/exercises?type=breathing" replace />} />
              <Route path="/coping" element={<Navigate to="/resources?section=coping" replace />} />
              <Route path="/chat" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
          <FeatureModal />
        </div>
      </ChatProvider>
    </Router>
  );
}

export default App;