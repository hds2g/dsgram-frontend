import React, { useState } from "react";
import PropTypes from "prop-types";
import useInput from "../../Hooks/useInput";
import PostPresenter from "./PostPresenter";
import { useMutation } from "react-apollo-hooks";
import { TOGGLE_LIKE, ADD_COMMENT } from "./PostQueries";
import { toast } from "react-toastify";

const PostContainer = ({
  id,
  user,
  files,
  likeCount,
  isLiked,
  comments,
  createdAt,
  caption,
  location
}) => {
  const [isLikedS, setIsLiked] = useState(isLiked);
  const [likeCountS, setLikeCount] = useState(likeCount);
  const [currentItem, setCurrentItem] = useState(0);
  const [selfComments, setSelfComments] = useState([]);

  const comment = useInput("");

  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE, {
    variables: { postId: id }
  });

  const [addCommentMutation] = useMutation(ADD_COMMENT, {
    variables: { postId: id, text: comment.value }
  });

  const slideNext = () => {
    const totalFiles = files.length;
    if (currentItem === totalFiles - 1) {
      setCurrentItem(0);
    } else {
      setCurrentItem(currentItem + 1);
    }
  };
  const slidePrev = () => {
    const totalFiles = files.length;
    if (currentItem === 0) {
      setCurrentItem(totalFiles - 1);
    } else {
      setCurrentItem(currentItem - 1);
    }
  };
  const toggleLike = () => {
    toggleLikeMutation();
    if (isLikedS === true) {
      setIsLiked(false);
      setLikeCount(likeCountS - 1);
    } else {
      setIsLiked(true);
      setLikeCount(likeCountS + 1);
    }
  };

  const onKeyPress = async event => {
    const { which } = event;
    //console.log(which);
    if (which === 13) {
      event.preventDefault();
      comment.setValue("");
      try {
        const {
          data: { addComment }
        } = await addCommentMutation();
        //console.log(addComment);
        setSelfComments([...selfComments, addComment]);
      } catch {
        toast.error("Can't send comment");
      }
    }
  };
  //console.log(files);

  return (
    <PostPresenter
      user={user}
      files={files}
      likeCount={likeCountS}
      location={location}
      caption={caption}
      isLiked={isLikedS}
      comments={comments}
      createdAt={createdAt}
      newComment={comment}
      setIsLiked={setIsLiked}
      setLikeCount={setLikeCount}
      currentItem={currentItem}
      toggleLike={toggleLike}
      onKeyPress={onKeyPress}
      selfComments={selfComments}
      slidePrev={slidePrev}
      slideNext={slideNext}
    />
  );
};

PostContainer.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired
  }).isRequired,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  likeCount: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired
      }).isRequired
    })
  ).isRequired,
  caption: PropTypes.string.isRequired,
  location: PropTypes.string,
  createdAt: PropTypes.string.isRequired
};

export default PostContainer;
