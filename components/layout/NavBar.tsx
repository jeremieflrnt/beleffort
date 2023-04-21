import { useSession, signOut, signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import slugify from 'slugify';
import Settings from '../weightlifting/modals/Settings';
import { useState } from 'react';

const NavBar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const [openModalSettings, setOpenModalSettings] = useState(false);
  const handleToggleModalSettings = () =>
    setOpenModalSettings((prev) => {
      return !prev;
    });

  let right = (
    <div className="flex-1">
      <Link className="btn-ghost btn text-xl normal-case" href={'/'}>
        BelEffort
      </Link>
    </div>
  );
  let left = <></>;
  if (session) {
    const slugifiedName = slugify(session.user?.name ? session.user?.name : '/', { lower: true });
    right = (
      <div className="flex-1">
        <Link className="btn-ghost btn text-xl normal-case" href={`/`}>
          BelEffort
        </Link>
      </div>
    );
    left = (
      <div className="flex-none">
        {/* <Link className="btn-ghost btn text-xl normal-case" href={`/${slugifiedName}`}>
          My page
        </Link> */}
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link className="" href={`/${slugifiedName}`}>
              My page
            </Link>
          </li>
        </ul>
        <div className="dropdown-end dropdown">
          <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
            <div className="w-10">
              <Image className="rounded-full" alt="avatar" src={session.user?.image!} fill />
            </div>
          </label>
          <ul tabIndex={0} className="dropdown-content menu rounded-box menu-compact mt-3 w-fit bg-base-100 p-2 shadow">
            <li>
              <Link className="justify-between" href={`/${slugifiedName}`}>
                {session.user?.name}
              </Link>
            </li>
            <li>
              <a onClick={handleToggleModalSettings}>Settings</a>
            </li>
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    );
  } else {
    left = <></>;
  }
  return (
    <>
      <div className="navbar bg-base-100 2xl:px-10">
        <div className="w-full  2xl:container 2xl:mx-auto">
          {session && right}
          {left}
        </div>
      </div>
      <Settings open={openModalSettings} onClose={handleToggleModalSettings} onSubmit={() => {}} />
    </>
  );
};

export default NavBar;
