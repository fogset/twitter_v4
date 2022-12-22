import {
    ChartBarIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    EllipsisHorizontalIcon,
    HeartIcon,
    ShareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/24/solid";
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisIconFilled } from "@heroicons/react/24/solid";
import { db, storage } from "../firebase";
import Moment from "react-moment";

import { userState } from "../atom/userAtom";
import { useState, useEffect } from "react";
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    setDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { deleteObject, ref } from "firebase/storage";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atom/modalAtom";

export default function Post({ post, id }) {
    const [currentUser, setCurrentUser] = useRecoilState(userState);
    const [likes, setLikes] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);
    const [open, setOpen] = useRecoilState(modalState);
    const [postId, setPostId] = useRecoilState(postIdState);
    const router = useRouter();
    const [comments, setComments] = useState([]);

    useEffect(() => {
        onSnapshot(collection(db, "posts", post.id, "comments"), (snapshot) =>
            setComments(snapshot.docs)
        );
    }, [db]);
    useEffect(() => {
        onSnapshot(collection(db, "posts", post.id, "likes"), (snapshot) =>
            setLikes(snapshot.docs)
        );
    }, [db]);

    useEffect(() => {
        setHasLiked(
            likes.findIndex((like) => like.id === currentUser.uid) !== -1
        );
    }, [likes]);

    async function likePost() {
        if (currentUser) {
            if (hasLiked) {
                await deleteDoc(
                    doc(db, "posts", post.id, "likes", currentUser.uid)
                );
            } else {
                await setDoc(
                    doc(db, "posts", post.id, "likes", currentUser.uid),
                    {
                        username: currentUser.username,
                    }
                );
            }
        } else {
            signIn();
        }
    }
    function signIn() {
        router.push("/auth/signin");
    }

    async function deletePost() {
        if (window.confirm("Are you sure you want to delete this post?")) {
            deleteDoc(doc(db, "posts", post.id));
            if (post.data().image) {
                deleteObject(ref(storage, `posts/${post.id}/image`));
            }
        }
    }
    return (
        <div className="flex p-3 cursor-pointer border-b border-gray-200">
            {/*user image */}
            <img
                className="h-11 w-11 rounded-full mr-4"
                src={post.data().userImg}
                alt="user-img"
            />
            {/* right side */}
            <div className="flex-1">
                {/* Header */}
                <div className="flex items-center justify-between">
                    {/* post user info */}
                    <div className="flex items-center space-x-1 whitespace-nowrap">
                        <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                            {post.data().name}
                        </h4>
                        <span className="text-sm sm:text-[15px]">
                            @{post.data().username}
                        </span>
                        <span className="text-sm sm:text-[15px] hover:underline">
                            <Moment fromNow>
                                {post?.data()?.timestamp?.toDate()}
                            </Moment>
                        </span>
                    </div>
                    {/* dot icon */}
                    <EllipsisHorizontalIcon className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2" />
                </div>
                {/* post text */}
                <p
                    onClick={() => router.push(`posts/${postId}`)}
                    className="text-gray-800 text-[15px sm:text[16px] mb-2]"
                >
                    {post.data().text}
                </p>
                {/* post image */}
                <img
                    onClick={() => router.push(`posts/${postId}`)}
                    className="rounded-2xl mr-2"
                    src={post.data().image}
                />
                {/* icons  ChatBubbleOvalLeftEllipsisIcon*/}
                <div className="flex justify-between text-gray-500 p-2">
                    <div className="flex items-center select-none">
                        <ChatBubbleOvalLeftEllipsisIcon
                            onClick={() => {
                                if (!currentUser) {
                                    signIn();
                                } else {
                                    setPostId(post.id);
                                    setOpen(!open);
                                }
                            }}
                            className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"
                        />
                        {comments.length > 0 && (
                            <span className="text-sm">{comments.length}</span>
                        )}
                    </div>

                    {currentUser?.uid === post?.data().id && (
                        <TrashIcon
                            onClick={deletePost}
                            className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
                        />
                    )}

                    <div className="flex items-center">
                        {hasLiked ? (
                            <HeartIconFilled
                                onClick={likePost}
                                className="h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100"
                            />
                        ) : (
                            <HeartIcon
                                onClick={likePost}
                                className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
                            />
                        )}
                        {likes.length > 0 && (
                            <span
                                className={`${
                                    hasLiked && "text-red-600"
                                } text-sm select-none`}
                            >
                                {" "}
                                {likes.length}
                            </span>
                        )}
                    </div>

                    <ShareIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
                    <ChartBarIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
                </div>
            </div>
        </div>
    );
}
