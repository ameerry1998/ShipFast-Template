import { spawn } from "child_process";

export async function POST(request) {
  try {
    const { subreddit, keywords } = await request.json();

    if (!subreddit?.trim() || !keywords?.trim()) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const scriptPath = `${process.cwd()}/scripts/run_scraper.py`;

    const py = spawn("python3", [scriptPath, subreddit.trim(), keywords]);

    let stdout = "";
    let stderr = "";

    py.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    py.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    const exitCode = await new Promise((resolve) => {
      py.on("close", resolve);
    });

    if (exitCode !== 0) {
      return new Response(
        JSON.stringify({ error: stderr || "Scraper failed" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(stdout, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 