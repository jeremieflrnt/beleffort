import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import slugify from 'slugify';
import Settings from '../weightlifting/modals/Settings';

const NavBar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const handleLogout = async () => {
    console.log('Logout');

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
    left = (
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link className="" href={`/${slugifiedName}`}>
              My lifts
            </Link>
          </li>
        </ul>
        <div className="dropdown-end dropdown">
          <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
            <div className="w-10">
              <Image className="rounded-full" alt="avatar" src={session.user?.image!} fill />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu-compact dropdown-content menu rounded-box z-[1] mt-3 w-fit bg-base-100 p-2 shadow "
          >
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
          {right}
          {left}
        </div>
      </div>
      <Settings open={openModalSettings} onClose={handleToggleModalSettings} onSubmit={() => {}} />
    </>
  );
};

export default NavBar;
