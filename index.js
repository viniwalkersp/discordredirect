export default function handler(req, res) {
  res.writeHead(302, { Location: "https://discord.gg/DJwyTZWAJF" });
  res.end();
}
