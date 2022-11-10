import React from 'react';
import { type NextPage } from 'next';
import { trpc } from '../utils/trpc';
import { loadZxcvbn } from '../utils/client.util';
import { zxcvbn, zxcvbnOptions, ZxcvbnResult } from '@zxcvbn-ts/core';

// Components
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StrengthBar } from '../components/ui/StrengthBar';

const Home: NextPage = () => {
  const [password, setPassword] = React.useState('');
  const [pageLoad, setPageLoad] = React.useState(false);
  const [pwdStrength, setPwdStrength] = React.useState<ZxcvbnResult>(zxcvbn(''));
  const [acceptTerms, setAcceptTerms] = React.useState(false);

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
        <StrengthBar strength={pwdStrength.score} />
        <Input
          label="I accept the terms and conditions."
          type="checkbox"
          intent="default"
          id="termsofservice"
          checked={acceptTerms}
          onChange={(e) => {
            setAcceptTerms(!acceptTerms);
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
