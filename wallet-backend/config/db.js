import { neon } from "@neondatabase/serverless";

import "dotenv/config";

const SQL = neon(process.env.DATABASE_URL);

export default SQL;
