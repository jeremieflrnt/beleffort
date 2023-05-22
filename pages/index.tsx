import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import bg from 'public/pexels-victor-freitas-791763.jpg';
import slugify from 'slugify';
import screenshotWL from './../public/screenshotWL.png';

const HomePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  if (session) {
    const slugifiedName = slugify(session.user?.name ? session.user?.name : '/', { lower: true });
  }
  const handleGetStarted = () => {
    if (!session) signIn(undefined, { callbackUrl: '/' });
    else {
      const slugifiedName = slugify(session.user?.name ? session.user?.name : '/', { lower: true });
      router.push(slugifiedName);
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
            <button className="btn-primary btn" onClick={handleGetStarted}>
              Get Started
            </button>
          </div>
        </div>
      </div>
      <div className="hero h-[120vh] min-h-fit bg-slate-700 lg:h-[85svh]">
        <div className="hero-content flex-col text-neutral-content lg:flex-row">
          <div className="mockup-phone w-60 sm:w-80">
            <div className="camera !w-4/6"></div>
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
    </>
  );
};
export default HomePage;
