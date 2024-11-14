
'use client';
import Head from 'next/head'
import styles from './styles/Main.module.css';
import UserList from './components/UserList.client';
import { useAuth } from '@/app/contexts/AuthContext.client';
import UploadImage from './components/fileUpload/UploadImage.client';
import  UploadFile  from './components/fileUpload/UploadFile.client';
import { GovernanceAnalysis } from '@/app/components/governance/GovernanceAnalysis.client';

export default function HomePage() {
  const { user, checkAuth } = useAuth();

  return (
    <div className={styles.container}>
      <Head>
          <title>Governance Document Analysis</title>
          <meta name="description" content="A Next.js React application" />
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.title}>Governance Document Analysis</h1>
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
      <GovernanceAnalysis />
    </div>
  );
}