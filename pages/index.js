import Image from 'next/image';
import Link from 'next/link';


const Home = () => (
  <div className="landing_container" >
    <Image src="/assets/logo.svg" width="300px" height="100px" />

    <div className="landing_text">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </div>

    <div className="landing_boxes">
      <Link href="/login">
        <div className="shadow_box landing_box">
          <div>
            <div>Speechmatics™</div>
            <div style={{ color: '#5BB4AE' }}>Freemium</div>
          </div>
          <div className='landing_arrow green'>
            <Image src='/assets/arrow_right.svg' width='150px' height='15px' />
          </div>
        </div>
      </Link>
      <div className="shadow_box landing_box">
        <div>
          <div>Speechmatics™</div>
          <div style={{ color: '#004BAB' }}>Enterprise</div>
        </div>
        <div className='landing_arrow blue'>
          <Image src='/assets/arrow_right.svg' width='150px' height='15px' />
        </div>
      </div>
    </div>
  </div >
);

export default Home;
