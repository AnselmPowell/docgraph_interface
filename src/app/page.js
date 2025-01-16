
'use client';
import Head from 'next/head'
import styles from './styles/Main.module.css';
import UserList from './components/UserList.client';
import { useAuth } from './contexts/AuthContext.client';
import UploadImage from './components/fileUpload/UploadImage.client';
import  UploadFile  from './components/fileUpload/UploadFile.client';
import ResearchAssistant from './components/research/ResearchAssistant.client';

export default function HomePage() {
  const { user, checkAuth } = useAuth();

  return (
    <div className={styles.container}>
      <Head>
          <title>Research Document Analysis</title>
          <meta name="description" content="A Next.js React application" />
          <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {user && <p className={`${styles.description} text-lg mb-8 text-secondary`}>
        Welcome{' '}
        <code className={`${styles.code} bg-light rounded-sm p-2 font-mono text-xs text-primary`}>
        {user.username}!
        </code>
        <br/>
      </p>}
      {/* <UserList />
      <UploadImage/>
      <UploadFile/> */}
      <ResearchAssistant/>
    </div>
  );
}