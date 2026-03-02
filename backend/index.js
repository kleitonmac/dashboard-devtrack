import "dotenv/config";
import app from "./src/app.js";
import { connectDatabase } from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

await connectDatabase();

if (!process.env.VERCEL) {
  app.listen(PORT, () =>
    console.log(`🚀 API rodando em http://localhost:${PORT}`),
  );
}

export default app;
