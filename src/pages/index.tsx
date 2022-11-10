import React from 'react';
import { type NextPage } from 'next';
import { trpc } from '../utils/trpc';
import { loadZxcvbn } from '../utils/client.util';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';

// Components
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Home: NextPage = () => {
  const [password, setPassword] = React.useState('');
  const [pageLoad, setPageLoad] = React.useState(false);
  const [pwdStrength, setPwdStrength] = React.useState({});

  React.useEffect(() => {
    if (!pageLoad) {
      loadOptions();
      setPageLoad(true);
    }
  }, []);
  React.useEffect(() => {
    let results = zxcvbn(password);
    setPwdStrength(results);
  }, [password]);

  async function loadOptions(): Promise<void> {
    console.log(`Loaded options.`);
    let options = await loadZxcvbn();
    zxcvbnOptions.setOptions(options);
    return Promise.resolve();
  }

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center font-spacemono">
      <div className="flex min-w-[250px] flex-col">
        <h1 className="my-2 text-4xl font-bold">Sign Up</h1>
        <Input
          label="Password"
          type="password"
          intent="default"
          id="password"
          fullWidth={true}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button
          letterSpaced={true}
          onClick={() => {
            console.log('Clicked');
          }}>
          Signup
        </Button>
      </div>
    </main>
  );
};

export default Home;
