const { WebSocketServer } = require("ws");
const Note = require("./models/notes");

const clients = new Map();

function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const noteId = url.searchParams.get("noteId");
    // const token = url.searchParams.get('token')

    if (!noteId) return ws.close();

    try {
      //   jwt.verify(token, process.env.JWT_SECRET); // Optional: Authenticate user
    } catch (err) {
      return ws.close();
    }

    if (!clients.has(noteId)) clients.set(noteId, []);
    clients.get(noteId).push(ws);

    ws.on("message", async (data) => {
      const { content, title } = JSON.parse(data.toString());

      await Note.findByIdAndUpdate(noteId, {
        title,
        content,
      });

      clients.get(noteId).forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ content, title }));
        }
      });
    });

    ws.on("close", () => {
      const updated = clients.get(noteId)?.filter((client) => client !== ws);
      if (updated && updated.length) {
        clients.set(noteId, updated);
      } else {
        clients.delete(noteId);
      }
    });
  });
}

module.exports = { setupWebSocket };
