import Dashboard from '../components/dashboard';

export default function Account({}) {
  return (
    <Dashboard>
      <h1>Account</h1>
      <div className="account_forms">
        <section>
          <div>
            <input type="text" placeholder="title" value={''}></input>
            <input type="text" placeholder="First name" value={''}></input>
            <input type="text" placeholder="Surname"></input>
          </div>
          <div>
            <input type="text" placeholder="email" value={``}></input>
          </div>
          <div>
            <input type="text" placeholder="phone number"></input>
          </div>
          <div className="default_button">Apply changes</div>
        </section>
        <section>
          <div>
            <input type="text" placeholder="new password"></input>
            <input type="text" placeholder="repeat new password"></input>
          </div>
          <div className="default_button">Submit password changes</div>
        </section>
        <section>
          <div className="description_text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </div>
          <div className="default_button red">Remove account</div>
        </section>
      </div>
    </Dashboard>
  );
}
