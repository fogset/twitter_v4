import {
    PhotoIcon,
    FaceSmileIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useRecoilState } from "recoil";
import { userState } from "../atom/userAtom";
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useState, useRef } from "react";
import { db, storage } from "../firebase";

export default function input() {
    const [currentUser, setCurrentUser] = useRecoilState(userState);
    console.log(currentUser);
    const [input, setInput] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const filePickerRef = useRef(null);
    const sendPost = async () => {
        if (loading) return;
        setLoading(true);

        const docRef = await addDoc(collection(db, "posts"), {
            id: currentUser.uid,
            text: input,
            userImg: currentUser.userImg,
            timestamp: serverTimestamp(),
            name: currentUser.name,
            username: currentUser.username,
        });

        const imageRef = ref(storage, `posts/${docRef.id}/image`);

        if (selectedFile) {
            await uploadString(imageRef, selectedFile, "data_url").then(
                async () => {
                    const downloadURL = await getDownloadURL(imageRef);
                    await updateDoc(doc(db, "posts", docRef.id), {
                        image: downloadURL,
                    });
                }
            );
        }
        setInput("");
        setSelectedFile(null);
        setLoading(false);
    };
    function addImageToPost(e) {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result);
        };
    }

    return (
        <div>
            {currentUser && (
                <div className="flex border-b border-gray-200 p-3 space-x-3">
                    <img
                        src="https://image.shutterstock.com/image-photo/mountains-under-mist-morning-amazing-260nw-1725825019.jpg"
                        alt="user-image"
                        className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
                    />
                    <div className="w-full">
                        <div className="divide-y divide-gray-200">
                            <textarea
                                className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700"
                                rows="2"
                                placeholder="What's happening?"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            ></textarea>
                        </div>
                        {selectedFile && (
                            <div className="relative">
                                <XMarkIcon
                                    onClick={() => setSelectedFile(null)}
                                    className="h-7 text-black absolute cursor-pointer shadow-md shadow-white rounded-full"
                                />
                                <img
                                    src={selectedFile}
                                    className={`${loading && "animate-pulse"}`}
                                />
                            </div>
                        )}
                        <div className="flex items-center justify-between pt-2.5">
                            {!loading && (
                                <div>
                                    <div className="flex">
                                        <div
                                            className=""
                                            onClick={() =>
                                                filePickerRef.current.click()
                                            }
                                        >
                                            <PhotoIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                                            <input
                                                type="file"
                                                hidden
                                                ref={filePickerRef}
                                                onChange={addImageToPost}
                                            />
                                        </div>
                                        <FaceSmileIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                                    </div>
                                    <button
                                        onClick={sendPost}
                                        disabled={!input.trim()}
                                        className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                                    >
                                        Tweet
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
