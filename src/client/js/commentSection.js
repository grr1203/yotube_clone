const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const comments = document.querySelectorAll(".video__comment");

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") return;

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleDelete = async (event) => {
  if (event.target.id !== "deleteBtn") return;

  const comment = event.target.parentElement;
  const commentId = comment.dataset.id;
  const response = await fetch(`/api/comment/${commentId}/delete`, {
    method: "DELETE",
  });
  if (response.status !== 200) return;

  comment.parentElement.removeChild(comment);
};

function addComment(text, id) {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  newComment.addEventListener("click", handleDelete);
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = `${text}`;
  const span2 = document.createElement("span");
  span2.id = "deleteBtn";
  span2.innerText = `❌`;
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
}

if (form) {
  form.addEventListener("submit", handleSubmit);
}
comments.forEach((comment) => {
  comment.addEventListener("click", handleDelete);
});
