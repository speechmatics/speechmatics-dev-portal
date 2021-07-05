import Image from 'next/image';

const Home = () => (
  <div className="home">
    <Image src="/logo.svg" width="200px" height="100px" />

    <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>

    <div style={{ display: 'flex' }}>
      <div className="shadow_box" style={{ width: '25em', height: '20em' }}>
        <div>Speechmatics™</div>
        <div>Freemium</div>
      </div>
      <div className="shadow_box" style={{ width: '25em', height: '20em' }}>
        <div>Speechmatics™</div>
        <div>Enterprise</div>
      </div>

    </div>
  </div>
);

export default Home;
