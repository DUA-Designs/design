import { createBrowserRouter } from "react-router";
import { SplashScreen } from "./screens/SplashScreen";
import { AuthFlow } from "./screens/AuthFlow";
import { HomeScreen } from "./screens/HomeScreen";
import { BPLogScreen } from "./screens/BPLogScreen";
import { TriviaScreen } from "./screens/TriviaScreen";
import { DietLogScreen } from "./screens/DietLogScreen";
import { ExerciseLogScreen } from "./screens/ExerciseLogScreen";
import { FamilyScreen } from "./screens/FamilyScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { ClinicianDashboard } from "./screens/ClinicianDashboard";
import { MedicationScreen } from "./screens/MedicationScreen";
import { GamesScreen } from "./screens/GamesScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SplashScreen,
  },
  {
    path: "/auth",
    Component: AuthFlow,
  },
  {
    path: "/home",
    Component: HomeScreen,
  },
  {
    path: "/bp-log",
    Component: BPLogScreen,
  },
  {
    path: "/trivia",
    Component: TriviaScreen,
  },
  {
    path: "/diet-log",
    Component: DietLogScreen,
  },
  {
    path: "/exercise-log",
    Component: ExerciseLogScreen,
  },
  {
    path: "/family",
    Component: FamilyScreen,
  },
  {
    path: "/profile",
    Component: ProfileScreen,
  },
  {
    path: "/clinician",
    Component: ClinicianDashboard,
  },
    {
    path: "/medication",
    Component: MedicationScreen ,
  },
  {
    path: "/games",
    Component: GamesScreen,
  },
]);