import { getCsrfToken, getProviders, getSession, signIn } from 'next-auth/react';
import Head from 'next/head';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

type Props = {
  providers: any;
  csrfToken: any;
};

function Signin(props: Props) {
  return (
    <>
      <Head>
        <title>BelEffort - Sign in!</title>
        <meta name="description" content="BelEffort - Sign in!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="hero min-h-full bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <div className="py-6">
              <p>Join the Community of Dedicated Lifters!</p>
              <p>
                Sign in with Google or GitHub to Unlock a World of Weightlifting Excellence. Join our supportive
                community of fitness enthusiasts and take your lifting game to the next level. From tracking PRs to
                setting goals, our app is your key to reaching new heights in your weightlifting journey.
              </p>
              <p>Sign in now and become part of our thriving community of passionate lifters!</p>
            </div>
          </div>
          <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
            <div className="card-body">
              <div className="flex flex-col">
                {Object.values(props.providers).map((provider: any) => {
                  return (
                    <div className="m-4" key={provider.name}>
                      <button className="btn-outline btn w-full gap-2" onClick={() => signIn(provider.id)}>
                        {provider.name === 'Google' && <FcGoogle size="2em" />}
                        {provider.name === 'GitHub' && <FaGithub size="2em" />}
                        Sign in with {provider.name}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signin;

export async function getServerSideProps(context: any) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: '/' },
    };
  }

  return {
    props: {
      providers: await getProviders(),
      csrfToken: await getCsrfToken(),
    },
  };
}
