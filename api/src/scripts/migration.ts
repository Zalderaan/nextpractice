import "dotenv/config";
import mongoose from "mongoose";
import Application, {
  IApplication,
} from "../modules/applications/Application.model";

type BackfillStep = {
  name: string;
  filter: Record<string, unknown>;
  update: Record<string, unknown>;
};

const steps: BackfillStep[] = [
  {
    name: "assessmentStatus -> none when missing",
    filter: { assessmentStatus: { $exists: false } },
    update: { $set: { assessmentStatus: "none" } },
  },
  {
    name: "thankYouEmailSent -> false when missing",
    filter: { thankYouEmailSent: { $exists: false } },
    update: { $set: { thankYouEmailSent: false } },
  },
  {
    name: "assessmentDeadline -> null when missing",
    filter: { assessmentDeadline: { $exists: false } },
    update: { $set: { assessmentDeadline: null } },
  },
  {
    name: "nextInterviewAt -> null when missing",
    filter: { nextInterviewAt: { $exists: false } },
    update: { $set: { nextInterviewAt: null } },
  },
  {
    name: "lastInterviewAt -> null when missing",
    filter: { lastInterviewAt: { $exists: false } },
    update: { $set: { lastInterviewAt: null } },
  },
  {
    name: "offerDeadline -> null when missing",
    filter: { offerDeadline: { $exists: false } },
    update: { $set: { offerDeadline: null } },
  },
  {
    name: "nudgedAt -> null when missing",
    filter: { nudgedAt: { $exists: false } },
    update: { $set: { nudgedAt: null } },
  },
];

// ...existing code...

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  const commit =
    process.argv.includes("--commit") ||
    process.env.MIGRATION_COMMIT === "true";

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
  console.log(commit ? "Mode: COMMIT" : "Mode: DRY RUN");

  let totalMatched = 0;
  let totalModified = 0;

  for (const step of steps) {
    const matched = await Application.countDocuments(step.filter);
    totalMatched += matched;

    if (!commit) {
      console.log("[DRY RUN]", step.name, "matched:", matched);
      continue;
    }

    const result = await Application.updateMany(step.filter, step.update);
    totalModified += result.modifiedCount;
    console.log(
      "[COMMIT]",
      step.name,
      "matched:",
      result.matchedCount,
      "modified:",
      result.modifiedCount,
    );
  }

  console.log("Summary matched:", totalMatched);
  if (commit) {
    console.log("Summary modified:", totalModified);
  }

  const remainingMissing = await Application.countDocuments({
    $or: [
      { assessmentStatus: { $exists: false } },
      { thankYouEmailSent: { $exists: false } },
      { assessmentDeadline: { $exists: false } },
      { nextInterviewAt: { $exists: false } },
      { lastInterviewAt: { $exists: false } },
      { offerDeadline: { $exists: false } },
      { nudgedAt: { $exists: false } },
    ],
  });

  console.log("Remaining docs with missing fields:", remainingMissing);

  await mongoose.disconnect();
  console.log("Done");
}

run().catch(async (err) => {
  console.error("Migration failed:", err);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
