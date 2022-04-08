import Link from 'next/link';
import { SpeechmaticsLogo } from '../components/icons-library';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    let st: number;
    st = window.setTimeout(() => router.push('/login/'), 0);
    return () => window.clearTimeout(st);
  }, []);

  return (
    <div className="login_container">
      <SpeechmaticsLogo />
    </div>
  );
}
