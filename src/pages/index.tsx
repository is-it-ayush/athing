import { type NextPage } from 'next';
import { trpc } from '../utils/trpc';

// Components
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Home: NextPage = () => {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center font-spacemono">
      <div className="flex min-w-[250px] flex-col">
        <h1 className="my-2 text-4xl font-bold">Sign Up</h1>
        <Input label="Password" type="password" intent="default" id="password" fullWidth={true} />
        <Button
          letterSpaced={true}
          onClick={() => {
            console.log('Clicked');
          }}
        >
          Signup
        </Button>
      </div>
    </main>
  );
};

export default Home;
