import Head from 'next/head';
import Link from 'next/link';

const TermsAndPrivacyPage = () => {
  return (
    <>
      <Head>
        <title>BelEffort - Terms and Conditions / Privacy Policy</title>
        <meta name="description" content="Terms and Conditions / Privacy Policy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="my-4 uppercase">Terms and Conditions</h1>
      <p className="my-2">
        Welcome to our website! By using this website, you agree to comply with and be bound by the following terms and
        conditions:
      </p>
      <ol>
        <li>
          This website is intended for individuals aged 18 years or older. If you are younger than 18, you must not use
          this website.
        </li>
        <li>
          You are responsible for maintaining the confidentiality of your Google and Github accounts and any activities
          that occur under your account.
        </li>
        <li>
          We may collect and store your email address, name, avatar, and personal information related to the purpose of
          the website, such as recorded lifts and weight progress.
        </li>
        <li>
          We will not share, sell, or distribute your personal information to any third parties without your consent,
          except as required by law.
        </li>
        <li>You must not use this website for any illegal or unauthorized purpose.</li>
        <li>
          We reserve the right to modify or terminate the services provided on this website for any reason, without
          notice, at any time.
        </li>
        <li>
          We may update these terms and conditions from time to time. It is your responsibility to review this page
          periodically for changes.
        </li>
        <li>Your use of this website constitutes your acceptance of these terms and conditions.</li>
      </ol>

      <h1 className="my-4 uppercase">Privacy Policy</h1>
      <p className="my-2">
        Your privacy is important to us. This privacy policy outlines how we collect, use, and protect your personal
        information:
      </p>
      <ol>
        <li>
          We collect your email address, name, avatar, and personal information related to tracking progress on
          weightlifting movements.
        </li>
        <li>
          We use this information solely for the purpose of providing you with the services offered on this website,
          including tracking your weightlifting progress.
        </li>
        <li>
          Your personal information is securely stored in our database and is accessible only to authorized personnel.
        </li>
        <li>We may use your email address to send you important updates and information related to the website.</li>
        <li>
          We will not disclose your personal information to third parties except as required by law or with your
          explicit consent.
        </li>
        <li>
          We take appropriate measures to protect your personal information from unauthorized access, alteration, or
          destruction.
        </li>
        <li>
          If you wish to delete your account and personal information from our database, please contact us using the
          provided contact information.
        </li>
        <li>
          By using this website and providing your personal information, you consent to the terms of this privacy
          policy.
        </li>
      </ol>

      <p className="my-2">
        If you have any questions or concerns about our terms and conditions or privacy policy, please contact us at:{' '}
        <Link href={'https://github.com/jeremieflrnt'}>@jeremieflrnt.</Link>
      </p>
    </>
  );
};
export default TermsAndPrivacyPage;
