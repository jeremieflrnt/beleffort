import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import bg from 'public/pexels-victor-freitas-791763.jpg';
import slugify from 'slugify';
import screenshotWL from './../public/screenshotWL.png';

const HomePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const handleGetStarted = async () => {
    if (!session) await signIn(undefined, { callbackUrl: '/' });
    else {
      const slugifiedName = slugify(session.user?.name ? session.user?.name : '/', { lower: true });
      await router.push(slugifiedName);
    }
  };
  return (
    <>
      <Head>
        <title>BelEffort - Track Your Gains, Set New PRs!</title>
        <meta
          name="description"
          content="Track Your Gains, Set New PRs! Record and Save Your Best Performances for Multiple Weightlifting Movements with Ease."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="hero h-[85svh]" style={{ backgroundImage: `url(${bg.src})` }}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">BelEffort</h1>
            <p className="mb-5">
              Track Your Gains, Set New PRs! Record and Save Your Best Performances for Multiple Weightlifting Movements
              with Ease.
            </p>
            <p className="mb-5">
              BelEffort allows you to effortlessly track your PRs for various sets and repetitions. Plus, our app
              includes a handy calculator that estimates your theoretical 1RM based on your recorded PRs, helping you
              set achievable goals and push your limits. Join BelEffort now and elevate your weightlifting game to new
              heights!
            </p>
            {session && (
              <>
                <button className="btn-primary btn " onClick={handleGetStarted}>
                  My lifts
                </button>
              </>
            )}
            {!session && (
              <div className="flex w-full">
                <button className="btn-primary btn grid flex-grow place-items-center " onClick={handleGetStarted}>
                  Get Started
                </button>
                <div className="divider divider-horizontal">OR</div>
                <Link className="btn-secondary btn grid flex-grow place-items-center" href={'/demo'}>
                  Demo
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="hero h-[120vh] min-h-fit bg-slate-700 lg:h-[85svh]">
        <div className="hero-content flex-col text-neutral-content lg:max-w-screen-lg lg:flex-row">
          <div className="mockup-phone w-[70vw] max-w-sm sm:w-[30vw] lg:w-[20vw] xl:w-[30vw]">
            <div className="camera !w-1/2"></div>
            <div className="display">
              <Image alt="screenshot weightlifting" src={screenshotWL} />
            </div>
          </div>
          <div className="lg:w-[60vw]">
            <h1 className="text-5xl font-bold">Only what you want to see</h1>
            <p className="py-6">Track your Progress and Set New Personal Records with Ease!</p>
            <p>
              Our app&apos;s PR Tracker feature allows you to easily view your best lifts for specific sets, along with
              your current 1RM. Plus, our built-in calculator gives you a theoretical 1RM based on the set weight you
              enter, making it easier than ever to track your progress and see your gains in real-time. Try it now and
              take your lifting game to the next level!
            </p>
          </div>
        </div>
      </div>
      <footer className="footer footer-center bg-base-300 p-4 text-base-content">
        <div>
          <p>
            Copyright © 2023 - All right reserved by <Link href={'https://github.com/jeremieflrnt'}>@jeremieflrnt</Link>
            . <Link href={'/terms-and-privacy'}>Terms and Conditions / Privacy Policy</Link>
          </p>
        </div>
      </footer>
    </>
  );
};
export default HomePage;
