import Footer from './Footer';
import NavBar from './NavBar';

type Props = {
  children: React.ReactNode;
};

const Layout = (props: Props) => {
  return (
    <>
      <NavBar />
      <main className="relative flex h-max flex-auto flex-col items-center justify-center 2xl:container 2xl:m-auto">
        {props.children}
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
