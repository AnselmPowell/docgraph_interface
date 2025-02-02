
'use client';
import Head from 'next/head'

import { useAuth } from './contexts/AuthContext.client';
import ResearchAssistant from './components/research/ResearchAssistant.client';

export default function HomePage() {
  const { user, checkAuth } = useAuth();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="w-screen h-screen max-w-[100vw] max-h-[100vh] overflow-hidden">
        <Head>
          <title>Research Document Analysis</title>
          <meta name="description" content="A Next.js React application" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <ResearchAssistant/>
      </div>
    </div>
  );
}