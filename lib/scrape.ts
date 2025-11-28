// scrape-mealmap.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("start");

type Pantry = {
  name: string | null;
  address: string | null;
  state: string | null;
  city: string | null;
  find_food_link: string | null;
  donate_link: string | null;
  volunteer_link: string | null;
  phone: string | null;
  website: string | null;
  facebook_link: string | null;
  requirements: string | null;
  info: string | null;
};

// CHANGE THIS to your real CSV path
const CSV_PATH = path.join(
  __dirname,
  "food-locations-list-atlanta_food-locations-map-markers_captured-list_2025-11-19_04-41-03_019a9b7c-b770-7ef3-925e-c177563199e6.csv"
);

// Output file path
const DATA_DIR = path.join(__dirname, "data");
const OUTPUT_PATH = path.join(DATA_DIR, "pantries.json");

// Add your Firecrawl key here or use env var
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || "fc-REPLACE_ME";
console.log(FIRECRAWL_API_KEY,"beyonce");

async function scrapeOne(urlToScrape: string): Promise<Pantry | null> {
  const url = "https://api.firecrawl.dev/v2/scrape";

  const body = {
    url: urlToScrape,
    onlyMainContent: false,
    maxAge: 172800000,
    proxy: "stealth",
    parsers: [],
    formats: [
      {
        type: "json",
        schema: {
          type: "object",
          required: [],
          properties: {
            name: { type: "string" },
            address: { type: "string" },
            state: { type: "string" },
            city: { type: "string" },
            find_food_link: { type: "string" },
            donate_link: { type: "string" },
            volunteer_link: { type: "string" },
            phone: { type: "string" },
            website: { type: "string" },
            facebook_link: { type: "string" },
            requirements: { type: "string" },
            info: { type: "string" }
          }
        }
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer fc-5a04af097af64eada7bb2f19e9c1ba60`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error(`❌ Firecrawl error for ${urlToScrape}:`, response.status, response.statusText);
      return null;
    }

    const data: any = await response.json();

    if (!data.success || !data.data || !data.data.json) {
      console.error(`⚠️ No json data returned for ${urlToScrape}`, data);
      return null;
    }

    const extracted = data.data.json as Partial<Pantry>;

    return {
      name: extracted.name ?? null,
      address: extracted.address ?? null,
      state: extracted.state ?? null,
      city: extracted.city ?? null,
      find_food_link: extracted.find_food_link ?? urlToScrape,
      donate_link: extracted.donate_link ?? null,
      volunteer_link: extracted.volunteer_link ?? null,
      phone: extracted.phone ?? null,
      website: extracted.website ?? null,
      facebook_link: extracted.facebook_link ?? null,
      requirements: extracted.requirements ?? null,
      info: extracted.info ?? null
    };
  } catch (error) {
    console.error(`❌ Error scraping ${urlToScrape}:`, error);
    return null;
  }
}

function getLinksFromCsv(csvPath: string): string[] {
    const raw = fs.readFileSync(csvPath, "utf8");
    const lines = raw.trim().split("\n");
  
    if (lines.length < 2) {
      console.error("CSV seems empty or only has headers");
      return [];
    }
  
    const header = lines[0].split(",");
    const linkIndex = header.findIndex((h) =>
      h.toLowerCase().includes("resource link")
    );
  
    if (linkIndex === -1) {
      console.error("Could not find 'Resource Link' column:", header);
      return [];
    }
  
    return lines
      .slice(1)
      .map((line) => {
        const value = line.split(",")[linkIndex]?.trim();
        // Remove surrounding quotes if present
        return value?.replace(/^["']|["']$/g, '');
      })
      .filter(Boolean);
  }
async function main() {
  const links = getLinksFromCsv(CSV_PATH);
  console.log(`Found ${links.length} links in CSV`);

  const results: Pantry[] = [];

  for (const link of links) {
    console.log(`Scraping: ${link}`);
    const res = await scrapeOne(link);
    if (res) results.push(res);

    // Optional polite delay
    await new Promise((r) => setTimeout(r, 300));
  }

  // Make data folder if it doesn't exist
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }

  // Write JSON file
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), "utf8");

  console.log(`\n🎉 Done! Wrote ${results.length} pantry entries to:`);
  console.log(OUTPUT_PATH);
}

main().catch((err) => console.error("Fatal error:", err));
