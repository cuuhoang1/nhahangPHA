import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Account from "../../components/profile/Account";
import Order from "../../components/profile/Order";
import Password from "../../components/profile/Password";
import { toast } from "react-toastify";

const Profile = () => {
  const { data: session } = useSession();
  const [tabs, setTabs] = useState(0);
  const { push } = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!session) {
      push("/auth/login");
    } else {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.id}`);
          setUser(res.data);
  
          // Check table status
          const tableStatusRes = await axios.get(`/api/tables/checkTableStatus?tableName=${res.data.tableName}`);
          if (tableStatusRes.data.status === 'deactive') {
            handleSignOutstatus();  // Sign out if table is deactive
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchUser();
    }
  }, [session, push]);

  const handleSignOut = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tableName: user.tableName}), // Thay thế "1" bằng giá trị thực tế
      });
      signOut({ redirect: false });
      push("/auth/login");
      toast.success("Sign out successfully", {
        position: "bottom-left",
        theme: "colored",
      });
    }
  };

  const handleSignOutstatus = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tableName: user?.tableName }), // Ensure user is not null
    });
    signOut({ redirect: false });
    push("/auth/login");
    // toast.success("Sign out successfully", {
    //   position: "bottom-left",
    //   theme: "colored",
    // });
  };




  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex px-10 min-h-[calc(100vh_-_433px)] lg:flex-row flex-col lg:mb-0 mb-10">
      <div className="lg:w-80 w-100 flex-shrink-0 lg:h-[80vh] justify-center flex flex-col border-l-2 border-r-4 shadow-2xl">
        <div className="relative flex flex-col items-center px-10 py-5 border border-b-0">
        <b className="text-2xl mt-1">Khách bàn số: {user.tableName}</b>
          <b className="text-2xl mt-1">{user.fullName}</b>
        </div>
        <ul className="text-center font-semibold">
          {/* <li
            className={`border w-full p-3 cursor-pointer hover:bg-primary hover:text-white transition-all ${tabs === 0 && "bg-primary text-white"}`}
            onClick={() => setTabs(0)}
          >
            <i className="fa fa-home"></i>
            <button className="ml-1">Account</button>
          </li>
          <li
            className={`border w-full p-3 cursor-pointer hover:bg-primary hover:text-white transition-all ${tabs === 1 && "bg-primary text-white"}`}
            onClick={() => setTabs(1)}
          >
            <i className="fa fa-key"></i>
            <button className="ml-1">Password</button>
          </li> */}
          <li
            className={`border w-full p-3 cursor-pointer hover:bg-primary hover:text-white transition-all ${tabs === 2 && "bg-primary text-white"}`}
            onClick={() => setTabs(0)}
          >
            {/* <i className="fa fa-motorcycle"></i> */}
            <button className="ml-1">Xem danh sách Order</button>
          </li>
          <li className="border w-full p-3 cursor-pointer hover:bg-primary hover:text-white transition-all" onClick={handleSignOut}>
            <i className="fa fa-sign-out"></i>
            <button className="ml-1">Exit</button>
          </li>
        </ul>
      </div>
      {/* {tabs === 0 && <Account user={user} />}
      {tabs === 1 && <Password user={user} />} */}
      {tabs === 0 && <Order />}
    </div>
  );
};

export default Profile;
