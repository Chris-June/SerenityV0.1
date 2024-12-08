import { ExercisePage } from '@/components/exercises/ExercisePage';
import { BreathingExercise } from '@/components/exercises/BreathingExercise';
import { GuidedMeditation } from '@/components/exercises/GuidedMeditation';
import { GratitudePractice } from '@/components/exercises/GratitudePractice';
import { MoodLifting } from '@/components/exercises/MoodLifting';
import { RouteObject } from 'react-router-dom';

export const exerciseRoutes: RouteObject[] = [
  {
    path: '/exercises',
    element: <ExercisePage />,
  },
  {
    path: '/exercises/breathing',
    element: <BreathingExercise />,
  },
  {
    path: '/exercises/meditation',
    element: <GuidedMeditation />,
  },
  {
    path: '/exercises/gratitude',
    element: <GratitudePractice />,
  },
  {
    path: '/exercises/mood',
    element: <MoodLifting />,
  },
];
