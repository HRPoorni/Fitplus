import React, { useEffect, useState } from "react";
import "./Home.css";
import Post from "../../components/Post";
import { getAllPost } from "../../util/APIUtils";
import { toast } from "react-toastify";
import CreatePost from "../../components/CreatePost";
import PostLoader from "../../components/PostLoader";

const Home = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const fetchAllPost = async () => {
    setIsLoading(true);
    try {
      const response = await getAllPost();
      setPosts(response.reverse());
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast("Oops something went wrong!", { type: "error" });
    }
  };

  useEffect(() => {
    fetchAllPost();
  }, []);

  return (
    <div className="home-container bg-black">
      <div className="container">
        <CreatePost currentUser={currentUser} refetchPosts={fetchAllPost} />

        {isLoading ? (
          <PostLoader />
        ) : (
          posts.map(post => (
            <Post
              key={post.id}
              currentUser={currentUser}
              refetchPosts={fetchAllPost}
              {...post}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
