/**
 * ! Executing this script will delete all data in your database and seed it with 10 users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `bunx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://snaplet-seed.netlify.app/seed/getting-started/overview
 */
import { createSeedClient } from "@snaplet/seed";

const main = async () => {
	const seed = await createSeedClient();

	// Truncate all tables in the database
	// await seed.$resetDatabase();

	await seed.accounts((x) =>
		x(
			{ min: 5, max: 15 },
			{
				updated_at: null,
				projects: (x) => x({ min: 1, max: 10 }, { updated_at: null }),
			}
		)
	);

	console.log("Database seeding completed!");

	process.exit();
};

main();
