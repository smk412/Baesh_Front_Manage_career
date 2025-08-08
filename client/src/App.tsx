import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import RecommendedTeammates from "@/pages/RecommendedTeammates";
import CareerFeedback from "@/pages/CareerFeedback";
import Explore from "@/pages/Explore";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

// Import new pages
import OnboardingPage from "@/pages/OnboardingPage";
import MyClonePage from "@/pages/MyClonePage";
import ResumeEditorPage from "@/pages/ResumeEditorPage";
import ReferralPage from "@/pages/ReferralPage";
import ProgramBoardPage from "@/pages/ProgramBoardPage";
import SettingsPage from "@/pages/SettingsPage";
import MentorSearchPage from "@/pages/MentorSearchPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SelfIntor from "./pages/SelfIntro";

function Router() {
  const [location] = useLocation();

  const isLoginPage = location === "/login" || location === "/signup";

  return (
    <>
      {isLoginPage ? (
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />
          <Route component={NotFound} />
        </Switch>
      ) : (
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/selfintro" component={SelfIntor} />
            <Route path="/recommend" component={RecommendedTeammates} />
            <Route path="/feedback" component={CareerFeedback} />
            <Route path="/explore" component={Explore} />
            <Route path="/profile" component={Profile} />
            <Route path="/onboarding" component={OnboardingPage} />
            <Route path="/myclone" component={MyClonePage} />
            <Route path="/resume" component={ResumeEditorPage} />
            <Route path="/referral" component={ReferralPage} />
            <Route path="/program" component={ProgramBoardPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/mentor" component={MentorSearchPage} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
