import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Helmet } from "react-helmet";

createRoot(document.getElementById("root")!).render(
  <>
    <Helmet>
      <title>BAESH - AI 기반 커리어 에이전트</title>
      <meta name="description" content="BAESH - AI 기반 커리어 에이전트 플랫폼. 경험을 기록하고 포트폴리오를 생성하며 AI 피드백을 받아보세요." />
      <meta property="og:title" content="BAESH - AI 기반 커리어 에이전트" />
      <meta property="og:description" content="AI 기반 커리어 관리 및 팀원 매칭 플랫폼. 당신의 경력을 한 단계 업그레이드하세요." />
      <meta property="og:type" content="website" />
    </Helmet>
    <App />
  </>
);
