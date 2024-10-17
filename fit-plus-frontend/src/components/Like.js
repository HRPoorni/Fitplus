import React, { useState } from "react";
import { disLikePost, getPostById, likePost } from "../util/APIUtils";
import { toast } from "react-toastify";

const Like = props => {
  const [liked, setLiked] = useState(
    props.likes.filter(like => like.userId === props.currentUser.id).length > 0
  );
  const [likeCount, setLikeCount] = useState(props.likes.length);

  const handleLike = async () => {
    // like
    try {
      await likePost({
        postId: props.id,
        userId: props.currentUser.id
      });
      setLiked(true);
      setLikeCount(prevCount => prevCount + 1);
    } catch (error) {
      toast("Oops! something went wrong.", { type: "error" });
    }
  };

  const handleDislike = async () => {
    try {
      const post = await getPostById(props.id);
      const like = post.likes.filter(
        like => like.userId === props.currentUser.id
      )[0];

      await disLikePost({
        likeId: like.id
      });
      setLiked(false);
      setLikeCount(prevCount => prevCount - 1);
    } catch (error) {
      console.log(error);
      toast("Oops! something went wrong.", { type: "error" });
    }
  };

  return (
    <>
      {!liked ? (
        <div
          type="button"
          onClick={handleLike}
          className={
            "inline-flex justify-center p-2 text-gray-200 rounded-lg cursor-pointer hover:text-gray-200 hover:bg-gray-600 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
          }
        >
          <div className="pr-2 ">{likeCount}</div>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none"
               stroke="#ffffff" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="arcs">
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
      ) : (
        <div
          type="button"
          onClick={handleDislike}
          className={
            "inline-flex justify-center p-2 text-gray-200 rounded-lg cursor-pointer hover:text-gray-200 hover:bg-gray-600 dark:hover:bg-gray-600 dark:text-blue-500 dark:hover:text-blue-500"
          }
        >
          <div className="pr-2 ">{likeCount}</div>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none"
               stroke="#0676f7" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="arcs">
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
      )}
    </>
  );
};

export default Like;
