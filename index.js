import { exec } from 'child_process';

exec('npm run start', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error starting Next.js app: ${error}`);
    return;
  }
  console.log(stdout);
});
