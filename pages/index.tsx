import Link from 'next/link';
import { SpeechmaticsLogo, ArrowRight } from '../components/Icons';

export default function Home() {
  return (
    <div className="landing_container">
      <SpeechmaticsLogo />

      <div className="landing_text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua.
      </div>

      <div className="landing_boxes">
        <Link href="/login">
          <div className="shadow_box landing_box">
            <div>
              <div>Speechmatics™</div>
              <div style={{ color: '#5BB4AE' }}>Freemium</div>
            </div>
            <div className="landing_arrow green">
              <ArrowRight color="#5BB4AE" />
            </div>
          </div>
        </Link>
        <div className="shadow_box landing_box">
          <div>
            <div>Speechmatics™</div>
            <div style={{ color: '#004BAB' }}>Enterprise</div>
          </div>
          <div className="landing_arrow blue">
            <ArrowRight color="#004BAB" />
          </div>
        </div>
      </div>
    </div>
  );
}
