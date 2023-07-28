import { useRouter } from 'next/router';
import NavBar from './NavBar';

type Props = {
  children: React.ReactNode;
};

const Layout = (props: Props) => {
  const router = useRouter();
  const isHomepage = router.asPath === '/';

  return (
    <>
      <NavBar />
      <main
        className={`relative flex h-max flex-auto flex-col items-center justify-center ${
          !isHomepage ? '2xl:container 2xl:m-auto' : ''
        }`}
      >
        {props.children}
      </main>
    </>
  );
};

export default Layout;
