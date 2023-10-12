import { Options } from "@mikro-orm/core";
import { User } from "./user.entity";

const config: Options = {
	entities: [User],
	dbName: "node-test",
	type: "postgresql",
	clientUrl: "postgresql://node-test:password123@localhost:5432/node-test",
};

export default config;
