import Image from "next/image";
import SidebarMenuItem from "./SidebarMenuItem";
import {
    BellIcon,
    BookmarkIcon,
    ClipboardIcon,
    HomeIcon,
    InboxIcon,
    UserIcon,
    HashtagIcon,
    EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
    return (
        <div className="hidden sm:flex flex-col p-2 xl:items-start fixed h-full">
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
                <SidebarMenuItem text="Notifications" Icon={BellIcon} />
                <SidebarMenuItem text="Messages" Icon={InboxIcon} />
                <SidebarMenuItem text="BookMarks" Icon={BookmarkIcon} />
                <SidebarMenuItem text="Lists" Icon={ClipboardIcon} />
                <SidebarMenuItem
                    text="More"
                    Icon={EllipsisHorizontalCircleIcon}
                />
            </div>
            {/* Button */}

            <button className="bg-blue-400 text-white rounded-full w-56 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline">
                Tweet
            </button>
            {/* Mini-Profile */}
            <div className="hoverEffect text-gray-700 flex items-center justify-center xl:justify-start mt-auto">
                <img
                    src="https://image.shutterstock.com/image-photo/mountains-under-mist-morning-amazing-260nw-1725825019.jpg"
                    alt="user-img"
                    className="h-10 w-10 rounded-full xl:mr-2"
                />
                <div className="leading-5 hidden xl:inline">
                    <h4 className="font-bold">sahand Ghavidel</h4>
                    <p className="text-gray-500">@codewithsahand</p>
                </div>
                <EllipsisHorizontalCircleIcon className="h-5 xl:ml-8 hidden xl:inline" />
            </div>
            {/* Twitter Logo */}
        </div>
    );
}
