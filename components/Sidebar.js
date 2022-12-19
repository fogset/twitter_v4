import Image from "next/image";
import SidebarMenuItem from "./SidebarMenuItem";
import {
    BellIcon,
    BookmarkIcon,
    ClipboardIcon,
    HomeIcon,
    InboxIcon,
    HashtagIcon,
    EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";
import { db } from "../firebase";
import { useRecoilState } from "recoil";
import { doc, getDoc } from "firebase/firestore";
import { userState } from "../atom/userAtom";
import { useRouter } from "next/router";

export default function Sidebar() {
    const [currentUser, setCurrentUser] = useRecoilState(userState);
    const auth = getAuth();
    const router = useRouter();
    console.log("currentUser");
    console.log(currentUser);
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const fetchUser = async () => {
                    const docRef = doc(
                        db,
                        "users",
                        auth.currentUser.providerData[0].uid
                    );
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setCurrentUser(docSnap.data());
                        console.log(currentUser);
                    }
                };
                fetchUser();
            }
        });
    }, []);
    function logout() {
        signOut(auth);
        setCurrentUser(null);
        router.reload();
    }
    function login() {
        router.push("/auth/signin");
    }

    return (
        <div className="hidden sm:flex flex-col p-2 xl:items-start fixed h-full xl:ml-24">
            {/* Twitter Logo */}
            <div className="hoverEffect p-0 hover:bg-blue-100 xl:px-1">
                <Image
                    width="50"
                    height="50"
                    src="https://help.twitter.com/content/dam/help-twitter/brand/logo.png"
                ></Image>
            </div>
            {/* Menu */}
            <div className="mt-4 mb-2.5 xl:items-start">
                <SidebarMenuItem text="Home" Icon={HomeIcon} active />
                <SidebarMenuItem text="Explore" Icon={HashtagIcon} />
                {currentUser && (
                    <div>
                        <SidebarMenuItem text="Notifications" Icon={BellIcon} />
                        <SidebarMenuItem text="Messages" Icon={InboxIcon} />
                        <SidebarMenuItem text="BookMarks" Icon={BookmarkIcon} />
                        <SidebarMenuItem text="Lists" Icon={ClipboardIcon} />
                        <SidebarMenuItem
                            text="More"
                            Icon={EllipsisHorizontalCircleIcon}
                        />
                        <button className="bg-blue-400 text-white rounded-full w-56 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline">
                            Tweet
                        </button>
                    </div>
                )}
            </div>

            {currentUser ? (
                <div className="mt-auto">
                    {/* Mini-Profile */}

                    <div
                        onClick={logout}
                        className="hoverEffect text-gray-700 flex items-center justify-center xl:justify-start mt-auto"
                    >
                        <img
                            src={currentUser.userImg}
                            alt="user-img"
                            className="h-10 w-10 rounded-full xl:mr-2"
                        />
                        <div className="leading-5 hidden xl:inline">
                            <h4 className="font-bold">{currentUser.name}</h4>
                            <p className="text-gray-500">
                                {currentUser.username}
                            </p>
                        </div>
                        <EllipsisHorizontalCircleIcon className="h-5 xl:ml-8 hidden xl:inline" />
                    </div>
                </div>
            ) : (
                <button
                    onClick={login}
                    className="bg-blue-400 text-white rounded-full w-56 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline"
                >
                    Signin
                </button>
            )}
        </div>
    );
}
