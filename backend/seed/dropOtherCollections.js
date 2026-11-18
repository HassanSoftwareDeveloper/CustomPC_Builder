import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

// Apna PC's own collections. Everything else is treated as "other project".
const KEEP = ["users", "products", "orders", "refreshtokens"];
const reallyDelete = process.argv.includes("--delete");

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const all = await mongoose.connection.db.listCollections().toArray();
    const extra = all.map((c) => c.name).filter((name) => !KEEP.includes(name));

    console.log("Database:", mongoose.connection.name);
    console.log("Collections that are NOT Apna PC:", extra);

    if (!reallyDelete) {
      console.log(
        "Dry run only. Nothing was deleted. Add --delete to remove them.",
      );
      return;
    }

    for (const name of extra) {
      await mongoose.connection.db.dropCollection(name);
      console.log("Dropped", name);
    }
  } catch (err) {
    console.error("Failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
};

run();
