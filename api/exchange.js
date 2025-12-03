export default async function handler(req, res) {
  const API_KEY = "f1d5ca13ec0d67c2ef78b766";
  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/MYR`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rates" });
  }
}
