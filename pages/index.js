import Image from 'next/image';

const Home = () => (
  <div className="home">
    <Image src="/logo.svg" width="300px" height="100px" />

    <div className="landing_text">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </div>

    <div className="landing_boxes">
      <div className="shadow_box landing_box">
        <div>Speechmatics™</div>
        <div style={{ color: '#5BB4AE' }}>Freemium</div>
      </div>
      <div className="shadow_box landing_box">
        <div>Speechmatics™</div>
        <div style={{ color: '#004BAB' }}>Enterprise</div>
      </div>
    </div>
  </div>
);

export default Home;
