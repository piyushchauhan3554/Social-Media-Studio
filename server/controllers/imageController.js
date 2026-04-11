import axios from 'axios'
export const imageController = async (req, res) => {
  try {
    const { prompt } = req.query;

    const searchRes = await axios.get("https://api.pexels.com/v1/search", {
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
      params: {
        query: prompt,
        per_page: 1,
        orientation: "square",
      },
      timeout: 15000,
    });

    const photo = searchRes.data.photos?.[0];

    if (!photo) {
      return res.status(404).json({ error: "No image found" });
    }

    const imgRes = await axios.get(photo.src.large, {
      responseType: "arraybuffer",
      timeout: 15000,
    });

    res.set("Content-Type", "image/jpeg");
    res.send(imgRes.data);

  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

