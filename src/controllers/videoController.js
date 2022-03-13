export const trending = (req, res) => res.send("Trending Videos");
export const search = (req, res) => res.send("Search Videos");
export const upload = (req, res) => res.send("Upload");
export const see = (req, res) => res.send(`See Video${req.params.id}`);
export const edit = (req, res) => res.send("Edit Video");
export const deleteVideo = (req, res) => res.send("Delete Video");
