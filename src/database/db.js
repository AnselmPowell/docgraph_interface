import { neon } from '@neondatabase/serverless';
import config from '@/config';

let sql;

if (config.databaseUrl) {
  sql = neon(config.databaseUrl);
} else {
  sql =  () => {
    console.log('Database query skipped on build');
    return Promise.resolve([]);
  };
}

export default sql;