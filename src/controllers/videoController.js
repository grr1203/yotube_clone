const fakeUser = {
  username: "Hyo",
  loggedIn: false,
};

let videos = [
  { title: "First Video", rating: 5, views: 1, id: 1 },
  { title: "Second Video", rating: 4, views: 59, id: 2 },
  { title: "Third Video", rating: 3, views: 59, id: 3 },
];

export const trending = (req, res) =>
  res.render("home", { pageTitle: "Home", fakeUser, videos });

export const search = (req, res) => res.send("Search Videos");

export const upload = (req, res) => res.send("Upload");

export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  res.render("watch", { pageTitle: `Watch ${video.title}`, video });
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  res.render("edit", { pageTitle: `Editing ${video.title}`, video });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  res.redirect(`/video/${id}`);
};

export const deleteVideo = (req, res) => res.send("Delete Video");
