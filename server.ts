import "dotenv/config";

import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  // ==========================================================
  // GEMINI CONFIGURATION
  // ==========================================================

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn(
      "GEMINI_API_KEY is not configured. Gemini features will use local fallback responses.",
    );
  }

  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      })
    : null;

  // ==========================================================
  // GEMINI LORE API
  // ==========================================================

  app.post("/api/gemini/lore", async (req, res) => {
    const {
      characterName = "",
      queryType = "",
      question = "",
    } = req.body as {
      characterName?: string;
      queryType?: string;
      question?: string;
    };

    const normName = characterName.toUpperCase().trim();

    try {
      let prompt = "";

      if (queryType === "base_lore") {
        prompt = `Generate a captivating, immersive, and vivid storybook fantasy lore for the character named "${characterName}" from the Tiny Realms universe.

The lore should be written in beautiful, poetic, and engaging language.

Provide exactly:

1. A compelling 3-paragraph backstory of their origins, powers, and adventures.
2. Exactly 3 distinct attributes/traits such as Element, Rarity, and Ability formatted cleanly.
3. A fun, mysterious trivia fact about them.

Do not make it a dry list of stats.

Keep it rich, storybook-like, whimsical, and immersive.

Ensure it is written in English.`;
      } else {
        prompt = `You are a celestial storykeeper of the Tiny Realms.

Answer this question about character "${characterName}":

"${question}"

The response must be written in the same whimsical, poetic, and captivating storybook style.

Keep it under 120 words.

Ensure it is written in English.`;
      }

      // ========================================================
      // GEMINI REQUEST
      // ========================================================

      if (!ai) {
        throw new Error("GEMINI_API_KEY is not configured.");
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          temperature: 0.8,
        },
      });

      const text = response.text || "No lore was found in the scroll.";

      return res.json({ text });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      console.warn(
        "Gemini Service high demand or offline. Using beautiful local chronicle fallbacks:",
        errorMessage,
      );

      // ========================================================
      // BASE LORE FALLBACK
      // ========================================================

      if (queryType === "base_lore") {
        // ------------------------------------------------------
        // MIRELLE V2
        // ------------------------------------------------------

        if (normName.includes("MIRELLE") && normName.includes("V2")) {
          return res.json({
            text: `Having ascended beyond her star-chasing origins, Mirelle v2 has shed her physical telescope to perceive the entire cosmos directly through her third eye. Now wearing the sacred golden angel garb of the High Council, her presence alone heals nearby weary souls and cleanses corrupt rifts in the fabric of the realms.

Her wings, woven from pristine solar flares and celestial silk, allow her to glide silently through both cosmic storms and deep, quiet voids. She now acts as a stellar ambassador, representing the starlight valleys at the High Council of Realms.

With her evolution complete, Mirelle v2 commands the high-frequency spectrum of light itself. Her stellar staff has transformed into an eternal quill that writes the destiny of stars yet to be born.

**Traits:**
- **Rarity:** Mythic
- **Element:** Light / Aether
- **Ability:** Ascension Glow

**Trivia:**
She no longer sleeps, but instead enters a deep celestial meditation that replenishes the stellar code of nearby friendly souls.`,
          });
        }

        // ------------------------------------------------------
        // MIRELLE
        // ------------------------------------------------------

        if (normName.includes("MIRELLE")) {
          return res.json({
            text: `Mirelle, a celestial being from the star-woven valleys of the Tiny Realms, spent her youth tracing the pathways of distant nebulas using her hand-carved telescope. When the Great Convergence began to pull the constellations closer, she grabbed her celestial staff to harness and capture the stray stellar codes before they faded into the dark void.

Armed with her stellar astrolabe and guided by the faint whispers of ancient celestial entities, Mirelle traverses the boundary lines between physical realms and pure starlight. Her journey is not merely about navigation, but about preserving the cosmic memories that define the very fabric of existence.

Though soft-spoken, Mirelle's resolve is as unyielding as the North Star. Whenever the shadow rifts threaten to consume the starlight valleys, she raises her nebula lantern to banish the dark anomalies and light the path for lost souls.

**Traits:**
- **Rarity:** Legendary
- **Element:** Star / Nebula
- **Ability:** Nebula Burst

**Trivia:**
She once fell asleep under a shooting star and woke up with glowing stardust in her hair that has remained ever since.`,
          });
        }

        // ------------------------------------------------------
        // BAMBORU
        // ------------------------------------------------------

        if (normName.includes("BAMBORU")) {
          return res.json({
            text: `Hailing from the misty roots of the Yggdrasil Seedling, Bamboru is a peaceful yet ancient spirit clothed in living forest moss. He possesses the unique capability to commune directly with the earth, calling upon ancient roots to shield travelers or instantly grow lush greenery in barren landscapes.

For centuries, Bamboru remained hidden from the eyes of outer adventurers, tending to the sacred sprouts and ensuring the balance of light and soil. When the convergence of dimensions disrupted the ancient ley lines, he stepped forth from the deep woods to safeguard his kin.

With a heart of gold and skin of ancient petrified bark, Bamboru offers a calm presence in times of conflict. His gentle steps leave trails of blooming bluebells, proving that life will always find a way to flourish even in the darkest soils.

**Traits:**
- **Rarity:** Epic
- **Element:** Earth / Wood
- **Ability:** Regenerate Sprout

**Trivia:**
Bamboru is extremely fond of warm morning rain and can sleep for a decade if the weather is cozy enough.`,
          });
        }

        // ------------------------------------------------------
        // BRUNKO
        // ------------------------------------------------------

        if (normName.includes("BRUNKO")) {
          return res.json({
            text: `Brunko, the sovereign lord of the Obsidian Ironwoods, is a seasoned warrior bear whose crown was forged in the core of a dying star. Clad in heavy obsidian armor and wielding a flame-gilded shield, he stands as an impenetrable bastion protecting the peaceful citizens of Tiny Realms from dimensional anomalies.

Through countless battles against the rift beasts, Brunko has earned the utmost respect of every clan in the realms. His sword does not seek war, but rather enforces the long-standing truce that keeps the realms in safe harmony.

Behind his fierce exterior lies a monarch of deep wisdom, dedicated to shielding the weak and teaching young cub warriors the value of honor, discipline, and defense.

**Traits:**
- **Rarity:** Legendary
- **Element:** Steel / Fire
- **Ability:** Royal Barrier

**Trivia:**
Despite his giant stature and heavy black obsidian armor, Brunko loves sweet wildflower honey and can name over a thousand species of forest flora.`,
          });
        }

        // ------------------------------------------------------
        // DEFAULT CHARACTER LORE
        // ------------------------------------------------------

        return res.json({
          text: `This character's legend is shrouded in mystifying mist. They are a beloved resident of the Tiny Realms, currently traveling through uncharted dimensional gateways.

**Traits:**
- **Rarity:** Unknown
- **Element:** Mystery
- **Ability:** Gateway Leap

**Trivia:**
They are rumored to carry a piece of the original cosmic forge in their pouch.`,
        });
      }

      // ========================================================
      // CUSTOM QUERY FALLBACK
      // ========================================================

      // --------------------------------------------------------
      // MIRELLE V2
      // --------------------------------------------------------

      if (normName.includes("MIRELLE") && normName.includes("V2")) {
        return res.json({
          text: `As Mirelle v2, the ascended celestial light shines upon your inquiry regarding "${question}". The High Council has foreseen that light always finds its way through the darkest rifts. Remain steadfast on your path!`,
        });
      }

      // --------------------------------------------------------
      // MIRELLE
      // --------------------------------------------------------

      if (normName.includes("MIRELLE")) {
        return res.json({
          text: `Looking through her hand-crafted telescope, Mirelle traces the stars to answer your query: "${question}". The stellar paths indicate that your journey is guided by the light of the ancient nebula.`,
        });
      }

      // --------------------------------------------------------
      // BAMBORU
      // --------------------------------------------------------

      if (normName.includes("BAMBORU")) {
        return res.json({
          text: `Bamboru rustles his mossy leaves as he ponders: "${question}". Like a seedling pushing through the earth, the answer grows within your soul: patience, deep breaths, and steady roots will reveal the way.`,
        });
      }

      // --------------------------------------------------------
      // BRUNKO
      // --------------------------------------------------------

      if (normName.includes("BRUNKO")) {
        return res.json({
          text: `Brunko the Bear King strikes his flame-gilded shield and responds to your query: "${question}". True strength lies in honor and shielding the weak. Keep your guard up and carry on!`,
        });
      }

      // --------------------------------------------------------
      // DEFAULT QUERY
      // --------------------------------------------------------

      return res.json({
        text: `The celestial storykeeper whispers into the wind regarding: "${question}". The sacred scrolls of the Tiny Realms reveal that all paths are interconnected under the eternal stars.`,
      });
    }
  });

  // ==========================================================
  // PRODUCTION / DEVELOPMENT
  // ==========================================================

  if (
    process.env.NODE_ENV === "production" ||
    process.env.DISABLE_HMR === "true"
  ) {
    app.use(express.static("dist"));

    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  } else {
    // Mount Vite Dev Middleware
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: true,
      },
      appType: "spa",
    });

    app.use(vite.middlewares);
  }

  // ==========================================================
  // SERVER
  // ==========================================================

  const port = 3000;

  app.listen(port, "0.0.0.0", () => {
    console.log(`
Tiny Realms Development Server
────────────────────────────────
Local:   http://localhost:${port}
Network: http://0.0.0.0:${port}
────────────────────────────────
  `);
  });
}

startServer().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.error("Failed to start server:", message);

  process.exit(1);
});
