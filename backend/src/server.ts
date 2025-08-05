import 'dotenv/config'; // Load .env as early as possible
import app from './app';
import logger from './utils/logger';
import { config } from './config/config';
import { connectDB } from './config/db';

async function startServer() {
  try {
    await connectDB();
    const port = config.PORT;
    app.listen(port, () => {
      logger.info(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server', error);
    process.exit(1);
  }
}

startServer();
