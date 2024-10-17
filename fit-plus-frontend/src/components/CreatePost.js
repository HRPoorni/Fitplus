import React, { useReducer } from "react";
import { toast } from "react-toastify";
import { createPost } from "../util/APIUtils";

const CreatePost = ({ currentUser, refetchPosts }) => {
  const initialState = {
    description: "",
    postType: "",
    fileUrl: [],
    userId: currentUser.id
  };

  const [post, setPost] = useReducer((prevState, newState) => {
    return { ...prevState, ...newState };
  }, initialState);

  const handleDescription = event => {
    setPost({ description: event.target.value });
  };
  const handleCategoryChange = event => {
    setPost({ postType: event.target.value });
  };

  const submitPost = async () => {
    if (!post.description) {
      toast("Post description is mandatory", { type: "error" });
      return;
    }
    if (!post.postType) {
      toast("Post Type is mandatory", { type: "error" });
      return;
    }
    if (post.fileUrl.length === 0) {
      toast("Please attach atleast 1 image", { type: "error" });
      return;
    }

    try {
      const response = await createPost(post);
      if (response) {
        toast("Post successfully created!", { type: "success" });
        setPost({ ...initialState });
        refetchPosts();
      }
    } catch (error) {
      console.log(error);
      toast("Oops! Something went wrong.", { type: "error" });
    }
  };

  const handleImageChange = event => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);

    if (files.length > 4) {
      alert("Please select up to 4 images");
      return;
    }

    const imagePromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises)
      .then(base64Images => {
        setPost({ fileUrl: base64Images });
      })
      .catch(error => {
        toast("Error converting images to base64:", { type: "error" });
      });
  };

  return (
    <>
      <div
        className="editor mx-auto w-10/12 flex flex-col text-gray-800 border rounded-lg border-gray-700 p-4 shadow-lg max-w-2xl">
        {/* Dropdown for selecting category */}
        <select
          onChange={handleCategoryChange}
          className="mb-4 p-2 rounded-lg bg-gray-800 text-white border border-gray-700 outline-none"
        >
          <option value="">Select Category</option>
          <option value="Current Workout Status">Current Workout Status</option>
          <option value="Workout Plan">Workout Plan</option>
          <option value="Meal Plan">Meal Plan</option>
        </select>
        <textarea
          onChange={handleDescription}
          value={post.description}
          className="description bg-gray-800 rounded-lg sec p-3 h-50 border text-white border-gray-700 outline-none"
          spellCheck="false"
          placeholder="Describe everything about here"
        ></textarea>
        <input
          id="attachments"
          value=""
          type="file"
          accept="image/*,video/*"
          onChange={handleImageChange}
          multiple
          className="hidden"
        />

        <div className="flex">
          {post.fileUrl.map((fileUrl, index) => {
            // Check if the URL is for an image or video
            const isImage = fileUrl.startsWith('data:image');
            const isVideo = fileUrl.startsWith('data:video');

            return (
              <div key={index} className="w-40 p-2">
                {isImage ? (
                  <img
                    src={fileUrl}
                    className="w-full h-auto"
                    alt={`Selected image ${index + 1}`}
                  />
                ) : isVideo ? (
                  <video
                    controls
                    autoPlay
                    muted
                    className="w-full h-auto"
                    loop
                  >
                    <source src={fileUrl} type="video/mp4" />
                    {/* Assuming MP4 format */}
                    Your browser does not support the video tag.
                  </video>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="icons flex text-gray-500 m-2">
          <label htmlFor="attachments">
            <div
              type="button"
              className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none"
                   stroke="#f7f1f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path
                  d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
              <span className="sr-only">Upload Files</span>
            </div>
          </label>
          <div className="count ml-auto">
            <div className="buttons flex">
              <div
                onClick={submitPost}
                className="rounded-md p-1 px-4 font-semibold cursor-pointer text-gray-100 bg-indigo-500 ml-auto"
              >
                Post
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
