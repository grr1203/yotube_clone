import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];

  if (keyword) {
    videos = await Video.find({
      title: { $regex: new RegExp(`${keyword}`, "i") },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload Video" });

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      owner: _id,
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", { pageTitle: "Upload Video" });
  }

  return res.redirect("/");
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video)
    return res.status(404).render("404", { pageTitle: "Video not found." });

  res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video)
    return res.status(404).render("404", { pageTitle: "Video not found." });
  if (video.owner !== String(req.session.user._id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }

  res.render("edit", { pageTitle: `Editing ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) return res.render("404", { pageTitle: "Video not found." });
  if (video.owner !== String(req.session.user._id)) {
    req.flash("error", "You are not the owner of the video.");
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  res.redirect(`/video/${id}`);
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video)
    return res.status(404).render("404", { pageTitle: "Video not found." });
  if (video.owner !== String(req.session.user._id)) {
    req.flash("error", "You are not the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);

  return res.redirect("/");
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) return res.sendStatus(404);

  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const {
    session: { user },
  } = req;

  const video = await Video.findById(id);
  if (!video) return res.sendStatus(404);

  const comment = await Comment.create({
    owner: user._id,
    text,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();

  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);
  if (!comment) return res.sendStatus(404);
  if (String(comment.owner) !== req.session.user._id)
    return res.sendStatus(401);

  await Comment.findByIdAndDelete(id);

  return res.sendStatus(200);
};
