console.log("start")

const schema = {
    type: 'object',
    properties: {
      pantry_title: { type: 'string' },
      logo_link: { type: 'string' },
      address: { type: 'string' },
      phone: { type: 'string' },
      website: { type: 'string' },
      description: { type: 'string' },
      state: { type: 'string' },
      counties_served: { type: 'string' },
      city: { type: 'string' },
      find_food_link: { type: 'string' },
      donate_link: { type: 'string' },
      volunteer_link: { type: 'string' },
    },
    required: ['title']
  };
  
  async function main() {
    const url = 'https://api.firecrawl.dev/v2/scrape';
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer fc-5a04af097af64eada7bb2f19e9c1ba60',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        "url": "https://www.feedingamerica.org/find-your-local-foodbank/all-food-banks",
        "onlyMainContent": true,
        "maxAge": 172800000,
        "timeout": 600000,
        "proxy": "stealth",
        "parsers": [],
        "formats": [
            {
                "type": "json",
                "schema": schema,
                "prompt": "Extract all food banks from the cards on this page and return them in a json array. There MUST be 50 food banks extracted and returned in the array. Donate link = \"GIVE LOCALLY\" button. Volunteer link = \"VOLUNTEER\" button. Find food link = \"FIND FOOD\" button.",
            }

        ]
      })
    };
    
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
  
  main();

// Scrape a website:
//const doc = await firecrawl.scrape('https://firecrawl.dev', { formats: ['json', 'html'] });
//console.log(doc);