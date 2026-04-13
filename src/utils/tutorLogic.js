// AI Tutor Logic — Rule-based Q&A with smart subject detection for ANY input

// ─────────────────────────────────────────────────────────── Knowledge Base ──
const KB = [
  // ── MATH ──────────────────────────────────────────────────────────────────
  { keys: ['quadratic','ax2','ax^2','bx+c'],
    answer: `📐 **Quadratic Formula:**\n\nx = (-b ± √(b² - 4ac)) / 2a\n\nFor ax² + bx + c = 0\n\n**Example:** x² - 5x + 6 = 0 → a=1, b=-5, c=6\nx = (5 ± 1)/2 → x=3 or x=2 ✅` },
  { keys: ['pythagoras','hypotenuse','right triangle','a2+b2','a²+b²'],
    answer: `📐 **Pythagoras Theorem:**\n\na² + b² = c²\n\n**Example:** a=3, b=4 → c=√25 = 5 ✅` },
  { keys: ['percentage','percent','%'],
    answer: `📊 **Percentage = (Part / Whole) × 100**\n\n**Example:** 45 out of 60 = (45/60)×100 = **75%** ✅` },
  { keys: ['area circle','circle area','πr','pi r'],
    answer: `⭕ **Area of Circle = π × r²**\n\nπ ≈ 3.14159\n\n**Example:** r = 7 → A = 3.14 × 49 = **153.86 sq units** ✅` },
  { keys: ['simple interest','s.i','s.i.'],
    answer: `💰 **SI = (P × R × T) / 100**\n\n**Example:** P=1000, R=5%, T=2yr → SI = ₹100 ✅` },
  { keys: ['compound interest','c.i','c.i.'],
    answer: `💰 **CI = P(1 + R/100)ⁿ - P**\n\n**Example:** P=1000, R=10%, n=2\n= 1000×(1.1)² - 1000 = **₹210 CI** ✅` },
  { keys: ['trigonometry','sin cos tan','sinθ','cosθ','tanθ','sine','cosine','tangent'],
    answer: `📐 **Trigonometry Basics:**\n\n• sin θ = Opposite/Hypotenuse\n• cos θ = Adjacent/Hypotenuse\n• tan θ = Opposite/Adjacent\n\n**Mnemonic:** SOH-CAH-TOA\n\nKey values: sin30°=½, cos60°=½, tan45°=1 ✅` },
  { keys: ['mean','median','mode','average','statistics'],
    answer: `📊 **Statistics:**\n\n**Mean** = Sum of all / Count\n**Median** = Middle value when sorted\n**Mode** = Most frequent value\n\n**Example:** {2,3,3,5,7}\nMean=4, Median=3, Mode=3 ✅` },
  { keys: ['lcm','hcf','gcd','highest common','lowest common'],
    answer: `🔢 **LCM & HCF:**\n\n**HCF** = Highest Common Factor (GCD)\n**LCM** = Lowest Common Multiple\n\nLCM × HCF = Product of two numbers\n\n**Example:** 12 & 18 → HCF=6, LCM=36 ✅` },
  { keys: ['algebra','equation','variable','solve for x'],
    answer: `🔢 **Algebra Basics:**\n\nAn equation keeps both sides equal.\n\n**Solve:** 2x + 5 = 13\n→ 2x = 13-5 = 8\n→ x = 4 ✅\n\nRule: Whatever you do to one side, do to the other!` },
  { keys: ['fraction','numerator','denominator'],
    answer: `🔢 **Fractions:**\n\n• **Add/Sub:** Same denominator needed → 1/4 + 2/4 = 3/4\n• **Multiply:** Top×Top / Bottom×Bottom → 2/3 × 3/4 = 6/12 = 1/2\n• **Divide:** Flip 2nd fraction & multiply → 2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 ✅` },
  { keys: ['prime number','prime'],
    answer: `🔢 **Prime Numbers:**\n\nA number divisible only by 1 and itself.\n\nFirst primes: 2, 3, 5, 7, 11, 13, 17, 19, 23...\n\nNote: 2 is the ONLY even prime number! ✅` },
  { keys: ['bodmas','pemdas','order of operations'],
    answer: `🔢 **BODMAS Rule:**\n\n**B**rackets → **O**f → **D**ivision → **M**ultiplication → **A**ddition → **S**ubtraction\n\n**Example:** 2 + 3 × 4 = 2 + 12 = **14** (not 20!) ✅` },
  { keys: ['profit','loss','cost price','selling price','cp','sp'],
    answer: `💰 **Profit & Loss:**\n\n• **Profit = SP - CP** (if SP > CP)\n• **Loss = CP - SP** (if CP > SP)\n• **Profit% = (Profit/CP) × 100**\n\n**Example:** CP=₹200, SP=₹250 → Profit=₹50, Profit%=25% ✅` },
  { keys: ['ratio','proportion'],
    answer: `🔢 **Ratio & Proportion:**\n\nRatio a:b = a/b\n\na:b = c:d (proportion) → a×d = b×c (cross multiply)\n\n**Example:** 2:3 = 4:x → x = (3×4)/2 = 6 ✅` },

  // ── SCIENCE / PHYSICS ──────────────────────────────────────────────────────
  { keys: ['newton first law','inertia','body at rest'],
    answer: `🍎 **Newton's 1st Law (Inertia):**\n\n"An object stays at rest or in uniform motion unless an external force acts on it."\n\n**Examples:**\n• Ball rolling stops due to friction\n• Passengers jerk forward when bus brakes ✅` },
  { keys: ['newton second law','f=ma','force mass acceleration'],
    answer: `⚡ **Newton's 2nd Law:**\n\n**F = m × a**\n\nForce = Mass × Acceleration\n\n**Example:** m=5kg, a=3m/s² → F = **15 N** ✅` },
  { keys: ['newton third law','action reaction','every action'],
    answer: `🚀 **Newton's 3rd Law:**\n\n"Every action has an equal and opposite reaction."\n\n**Examples:**\n• Rocket pushes gas down → gas pushes rocket up\n• You push wall → wall pushes you back ✅` },
  { keys: ['photosynthesis'],
    answer: `🌿 **Photosynthesis:**\n\n6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂\n\nPlants make food (glucose) using sunlight in **chloroplasts** (chlorophyll = green pigment) ✅` },
  { keys: ['respiration','aerobic','anaerobic'],
    answer: `🫁 **Respiration:**\n\n**Aerobic:** C₆H₁₂O₆ + O₂ → CO₂ + H₂O + Energy\n\n**Anaerobic** (no O₂):\n→ In muscles: Glucose → Lactic acid + Energy\n→ In yeast: Glucose → Ethanol + CO₂ + Energy ✅` },
  { keys: ['cell','cell structure','cell organelle','mitochondria','nucleus'],
    answer: `🔬 **Cell Structure:**\n\n**Both Plant & Animal:**\nNucleus, Mitochondria, Cell Membrane, Cytoplasm, Ribosome\n\n**Only Plant:** Cell Wall, Chloroplast, Large Central Vacuole\n**Only Animal:** Centrioles, Small vacuoles\n\nMitochondria = Powerhouse of cell ✅` },
  { keys: ["ohm's law",'ohm law','v=ir','current resistance'],
    answer: `⚡ **Ohm's Law:** V = I × R\n\nVoltage = Current × Resistance\n\n**Example:** I=2A, R=5Ω → V = **10 Volts** ✅\n\n**Tip:** V in Volts, I in Amperes, R in Ohms` },
  { keys: ['gravity','gravitational','g=','acceleration due to gravity'],
    answer: `🌍 **Gravity:**\n\ng = 9.8 m/s² (on Earth)\n\n**Weight = m × g**\n\n**Example:** mass = 10kg → Weight = 10 × 9.8 = **98 N**\n\nTip: Mass is same everywhere, Weight changes on Moon! ✅` },
  { keys: ['speed velocity acceleration','speed formula','velocity formula'],
    answer: `🚗 **Motion Formulas:**\n\n• Speed = Distance / Time\n• Velocity = Displacement / Time (direction matters)\n• Acceleration = (v-u) / t\n\n**v² = u² + 2as** (key equation!)\n\nExample: u=0, a=2, s=9 → v = √36 = 6 m/s ✅` },
  { keys: ['atom','electron','proton','neutron','atomic','nucleus of atom'],
    answer: `⚛️ **Atomic Structure:**\n\n• **Proton** (+) — in nucleus\n• **Neutron** (neutral) — in nucleus\n• **Electron** (-) — orbits nucleus\n\nAtomic Number = protons\nMass Number = protons + neutrons\n\nExample: Carbon has 6 protons, 6 neutrons, 6 electrons ✅` },
  { keys: ['acid base','ph scale','neutral','alkali'],
    answer: `🧪 **Acids & Bases:**\n\n**pH Scale:** 0-14\n• pH < 7 → Acid (HCl, vinegar)\n• pH = 7 → Neutral (water)\n• pH > 7 → Base/Alkali (NaOH, soap)\n\nIndicator: Litmus paper\n• Turns Red in acid\n• Turns Blue in base ✅` },
  { keys: ['lens','concave','convex','mirror','reflection','refraction'],
    answer: `🔭 **Light — Lens & Mirrors:**\n\n**Convex Lens:** Converges light → used in magnifying glass, camera\n**Concave Lens:** Diverges light → used for short-sightedness\n\n**Mirror Formula:** 1/f = 1/v + 1/u\n\nSnell's Law: n₁sinθ₁ = n₂sinθ₂ ✅` },

  // ── CHEMISTRY ─────────────────────────────────────────────────────────────
  { keys: ['periodic table','element','atomic number','valency'],
    answer: `⚗️ **Periodic Table:**\n\nElements arranged by atomic number.\n\n**Groups:** Vertical columns (same valency)\n**Periods:** Horizontal rows\n\nGroup 1 = Alkali metals (1 valence electron)\nGroup 17 = Halogens\nGroup 18 = Noble gases (inert) ✅` },
  { keys: ['chemical bond','ionic','covalent','metallic bond'],
    answer: `⚗️ **Chemical Bonds:**\n\n**Ionic:** Transfer of electrons (metal + non-metal)\n→ NaCl (table salt)\n\n**Covalent:** Sharing electrons (non-metals)\n→ H₂O, CO₂, CH₄\n\n**Metallic:** Free electrons in metals → conducts electricity ✅` },

  // ── BIOLOGY ───────────────────────────────────────────────────────────────
  { keys: ['dna','rna','genetics','chromosome','gene'],
    answer: `🧬 **DNA & Genetics:**\n\nDNA = Deoxyribonucleic Acid\n• Double helix structure (Watson & Crick, 1953)\n• Contains genes = instructions for traits\n• Bases: A-T, G-C\n\nRNA is single-stranded, carries messages from DNA\n\nHumans have 23 pairs of chromosomes (46 total) ✅` },
  { keys: ['food chain','ecosystem','producer','consumer','decomposer'],
    answer: `🌿 **Food Chain & Ecosystem:**\n\nSun → **Producer** (Plants) → **Primary Consumer** (Herbivore) → **Secondary Consumer** (Carnivore) → **Decomposer** (Fungi/Bacteria)\n\nEnergy flows one way: only 10% transfers each level\n\nEcosystem = All living + non-living things in an area ✅` },

  // ── ENGLISH ───────────────────────────────────────────────────────────────
  { keys: ['noun','types of noun','proper noun','common noun'],
    answer: `📝 **Types of Nouns:**\n\n1. **Proper** — "Delhi", "Ashutosh"\n2. **Common** — "city", "boy"\n3. **Abstract** — "love", "freedom"\n4. **Collective** — "team", "flock"\n5. **Countable/Uncountable** — apple/water ✅` },
  { keys: ['verb','types of verb','transitive','auxiliary'],
    answer: `📝 **Verbs:**\n\n**Transitive:** needs object → "She *kicked* the ball"\n**Intransitive:** no object → "He *slept*"\n**Auxiliary/Helping:** is, am, are, was, were, has, have, had, will, shall, do, does, did ✅` },
  { keys: ['adjective','degrees of comparison','comparative','superlative'],
    answer: `📝 **Adjectives — Degrees:**\n\n| Positive | Comparative | Superlative |\n|---|----|----|\n| big | bigger | biggest |\n| good | better | best |\n| bad | worse | worst |\n| beautiful | more beautiful | most beautiful | ✅` },
  { keys: ['tense','tenses','past tense','present tense','future tense'],
    answer: `📝 **Tenses:**\n\n**Present:** I eat / I am eating / I have eaten / I have been eating\n**Past:** I ate / I was eating / I had eaten\n**Future:** I will eat / I will be eating / I will have eaten\n\nTip: Regular past = add -ed, Irregular = memorize ✅` },
  { keys: ['parts of speech','grammar parts'],
    answer: `📝 **8 Parts of Speech:**\n\n1. **Noun** — person, place, thing\n2. **Pronoun** — he, she, they\n3. **Verb** — action/state\n4. **Adjective** — describes noun\n5. **Adverb** — describes verb\n6. **Preposition** — in, on, at, by\n7. **Conjunction** — and, but, or\n8. **Interjection** — Wow! Oh! ✅` },
  { keys: ['active passive','active voice','passive voice'],
    answer: `📝 **Active vs Passive Voice:**\n\n**Active:** Subject DOES the action\n→ "The dog bit the man."\n\n**Passive:** Subject RECEIVES the action\n→ "The man was bitten by the dog."\n\nFormula: Object + was/were + V3 + by + Subject ✅` },
  { keys: ['idiom','proverb','phrase'],
    answer: `📝 **Idioms & Proverbs:**\n\n**Common Idioms:**\n• "Bite the bullet" = endure pain bravely\n• "Break the ice" = start a conversation\n• "Hit the books" = study hard ← perfect for you! 📚\n\n**Proverb:** "Practice makes perfect" ✅` },

  // ── HISTORY ───────────────────────────────────────────────────────────────
  { keys: ['french revolution','1789','bastille'],
    answer: `🏛️ **French Revolution (1789):**\n\n**Causes:** Inequality, heavy taxes, food crisis\n**Key Events:**\n• Storming of Bastille — July 14, 1789\n• Declaration of Rights of Man\n• King Louis XVI executed — 1793\n**Result:** End of monarchy, rise of Napoleon ✅` },
  { keys: ['world war 1','ww1','first world war','1914'],
    answer: `🌍 **World War I (1914-1918):**\n\n**Trigger:** Assassination of Archduke Franz Ferdinand\n**Sides:** Allied (UK, France, Russia) vs Central (Germany, Austria)\n**Result:** Allied victory, Treaty of Versailles 1919\n**India:** Sent 1.5 million soldiers ✅` },
  { keys: ['world war 2','ww2','second world war','1939','hitler'],
    answer: `🌍 **World War II (1939-1945):**\n\n**Trigger:** Germany invaded Poland\n**Sides:** Allies (UK, USA, USSR) vs Axis (Germany, Italy, Japan)\n**Result:** Hiroshima & Nagasaki → Japan surrendered\n**Hitler died:** April 30, 1945\n**End:** September 2, 1945 ✅` },
  { keys: ['independence','1947','british','india independence','freedom'],
    answer: `🇮🇳 **Indian Independence:**\n\nIndia gained independence on **August 15, 1947**\n\n**Key Leaders:** Mahatma Gandhi, Nehru, Subhas Chandra Bose, Bhagat Singh\n\n**Partition:** India and Pakistan became separate nations\n\n1st PM: Jawaharlal Nehru\n1st President: Dr. Rajendra Prasad ✅` },
  { keys: ['mughal','akbar','aurangzeb','mughal empire','babur'],
    answer: `🏰 **Mughal Empire:**\n\n**Founders:** Babur (1526) — Battle of Panipat\n**Great Rulers:** Akbar (greatest), Jahangir, Shah Jahan, Aurangzeb\n\nAkbar = Known for Din-i-Ilahi, tolerance\nShah Jahan = Built Taj Mahal\nAurangzeb = Empire's largest extent ✅` },
  { keys: ['maurya','ashoka','chandragupta','mauryan'],
    answer: `🏰 **Mauryan Empire:**\n\nFounded by **Chandragupta Maurya** (321 BCE)\nAdvisor: Chanakya (Kautilya)\n\n**Ashoka the Great:**\n• Fought Kalinga War → converted to Buddhism\n• Spread Buddhism across Asia\n• National emblem — Lion Capital of Ashoka ✅` },

  // ── GEOGRAPHY ─────────────────────────────────────────────────────────────
  { keys: ['continent','continents','7 continent'],
    answer: `🌍 **7 Continents:**\n\n1. **Asia** — Largest, most populated\n2. **Africa** — 2nd largest\n3. **North America**\n4. **South America**\n5. **Antarctica** — Coldest, no permanent residents\n6. **Europe**\n7. **Australia/Oceania** — Smallest\n\nMnemonic: **A**sia **A**frica **N**orth **S**outh **A**ntarctica **E**urope **A**ustralia → **AANSAEA** ✅` },
  { keys: ['latitude','longitude','equator','prime meridian'],
    answer: `🗺️ **Latitude & Longitude:**\n\n**Latitude** = Horizontal lines\n• 0° = Equator\n• 90°N = North Pole, 90°S = South Pole\n\n**Longitude** = Vertical lines\n• 0° = Prime Meridian (Greenwich, UK)\n• 180° = International Date Line\n\nTip: "**Lat**itude is flat" ✅` },
  { keys: ['climate','weather','monsoon','season'],
    answer: `🌦️ **Climate vs Weather:**\n\n**Weather** = Short-term (today's rain)\n**Climate** = Long-term patterns (30 years avg)\n\n**India's Seasons:**\n1. Summer (Mar-May)\n2. Monsoon (Jun-Sep) — SW Monsoon\n3. Post-Monsoon (Oct-Nov)\n4. Winter (Dec-Feb) ✅` },
  { keys: ['river','ganges','himalaya','mountain','plateau'],
    answer: `🏔️ **Indian Geography:**\n\n**Major Rivers:** Ganges, Yamuna, Brahmaputra, Godavari, Krishna\n**Mountains:** Himalayas (K2 = 2nd highest peak)\n**Highest Peak in India:** Kangchenjunga\n**Largest Plateau:** Deccan Plateau\n**Desert:** Thar Desert (Rajasthan) ✅` },
  { keys: ['solar system','planet','sun','earth','moon','orbit'],
    answer: `🌌 **Solar System:**\n\n8 Planets: **My Very Educated Mother Just Served Us Noodles**\n(Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune)\n\n**Largest:** Jupiter | **Smallest:** Mercury\n**Nearest to Sun:** Mercury | **Farthest:** Neptune\n**Earth's Moon:** 1 | **Jupiter's moons:** 95+ ✅` },

  // ── COMPUTER SCIENCE ──────────────────────────────────────────────────────
  { keys: ['computer','hardware','software','cpu','ram','rom'],
    answer: `💻 **Computer Basics:**\n\n**Hardware** = Physical parts (CPU, RAM, keyboard)\n**Software** = Programs (Windows, Chrome)\n\n**CPU** = Brain of computer\n**RAM** = Temporary memory (faster, loses on shutdown)\n**ROM** = Permanent memory (stores BIOS)\n**Storage** = HDD/SSD (permanent data) ✅` },
  { keys: ['binary','bits','bytes','decimal','hexadecimal'],
    answer: `💻 **Number Systems:**\n\n**Binary** = Base-2 (0,1)\n**Decimal** = Base-10 (0-9)\n**Hexadecimal** = Base-16 (0-9, A-F)\n\nConvert: 1010₂ = (1×8)+(0×4)+(1×2)+(0×1) = **10** in decimal ✅\n\n8 bits = 1 Byte | 1024 Bytes = 1 KB` },
  { keys: ['internet','network','ip address','www','protocol','http'],
    answer: `🌐 **Internet & Networking:**\n\n**Internet** = Global network of computers\n**IP Address** = Unique ID for each device\n**HTTP/HTTPS** = Web page transfer protocol (S = Secure)\n**WWW** = World Wide Web (collection of web pages)\n\nHTTP uses port 80, HTTPS uses port 443 ✅` },
];

// ─────────────────────────────────────────── Smart Subject Detector ──
const SUBJECT_HINTS = {
  math:       ['calculat','number','sum','minus','plus','multiply','divid','equation','formula','mathematic','geometr','algebr','square','cube','root','digit','integer','decimal','angle','triangle','circle','volume','area','perimeter','circumference'],
  science:    ['energy','force','power','work done','pressure','temperature','heat','electric','magnet','wave','sound','light','motion','mass','weight','density','buoyanc','speed','velocity','acceleration','friction','momentum','pendulum'],
  biology:    ['cell','organ','tissue','blood','heart','lung','brain','bone','muscle','nerve','digest','enzyme','hormone','vitamin','bacteria','virus','immune','evolution','gene','heredit','chlorophyll','osmosis','diffusion'],
  chemistry:  ['element','compound','mixture','solution','acid','base','salt','metal','non-metal','react','bond','molecule','ion','oxidat','redox','catalyst','electrolysis','alloy','polymer'],
  english:    ['sentence','paragraph','essay','poem','story','write','grammar','spell','punctuat','synonym','antonym','vocab','comprehension','letter','article','speech','debate','story'],
  history:    ['king','queen','emperor','dynasty','war','battle','revolution','century','ancient','medieval','colonial','civilization','empire','treaty','independence','freedom fighter','nationalist','historic'],
  geography:  ['country','capital','state','district','city','map','globe','ocean','sea','lake','forest','desert','mountain','valley','plain','island','peninsula','climate','population','resource','crop','mineral'],
  computer:   ['program','code','algorithm','data','database','server','client','software','hardware','virus','malware','encryption','os','operating system','memory','processor','storage','input','output'],
};

function detectSubject(q) {
  const lower = q.toLowerCase();
  let best = null, bestScore = 0;
  for (const [subj, keywords] of Object.entries(SUBJECT_HINTS)) {
    const score = keywords.filter(k => lower.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = subj; }
  }
  return bestScore > 0 ? best : null;
}

const SUBJECT_ENCOURAGEMENTS = {
  math:      `📐 That's a Math question! Here's what I know:\n\nFor specific formulas, try asking like:\n"What is the quadratic formula?" or "How to find percentage?"\n\nRemember: Math is all about **practice** — solve 5 problems daily! 💪`,
  science:   `🔬 Great Science question! Try asking more specifically:\n"What is Newton's 2nd law?", "Explain photosynthesis", or "Ohm's law formula?"\n\nScience secret: Understand the **WHY**, not just the WHAT! ⚡`,
  biology:   `🧬 Biology question detected! Ask about:\n"Cell structure", "Photosynthesis", "DNA genetics", "Food chain"\n\nBio tip: Draw diagrams — they help 10× more than reading! 🌿`,
  chemistry: `⚗️ Chemistry question! Try:\n"Periodic table explained", "Types of chemical bonds", "Acid base pH"\n\nChem tip: Learn element symbols by making funny sentences! 🧪`,
  english:   `📝 English question! Try asking:\n"Types of nouns", "Explain tenses", "Active vs passive voice"\n\nEnglish tip: Read 10 minutes daily — your vocabulary will explode! 📖`,
  history:   `🏛️ History question! Try:\n"French Revolution", "World War 2", "Indian Independence", "Mughal Empire"\n\nHistory tip: Connect events to dates using story-telling! 📅`,
  geography: `🌍 Geography question! Try:\n"7 continents", "Latitude longitude", "Indian rivers", "Solar system"\n\nGeo tip: Use maps and atlases — visual learning works! 🗺️`,
  computer:  `💻 Computer Science! Try:\n"Computer hardware software", "Binary numbers", "Internet and networking"\n\nCS tip: Learn by doing — open a code editor and experiment! 👨‍💻`,
};

// ─────────────────────────────────────────────────────── Math Calculator ──
function tryMathCalc(q) {
  // Simple arithmetic detection
  const mathExpr = q.match(/[\d\s+\-*/().^]+/);
  if (!mathExpr) return null;
  const expr = mathExpr[0].trim();
  if (expr.length < 3) return null;
  try {
    // Basic safe eval for arithmetic only
    if (!/[a-zA-Z]/.test(expr) && /[\d]/.test(expr)) {
      const safeExpr = expr.replace(/\^/g, '**');
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; return (' + safeExpr + ')')();
      if (typeof result === 'number' && isFinite(result)) {
        return `🔢 **Calculator Result:**\n\n${expr.trim()} = **${Math.round(result * 10000) / 10000}**\n\nNeed a formula or explanation? Just ask! ✅`;
      }
    }
  } catch { /* not a valid expr */ }
  return null;
}

// ─────────────────────────────────────────────────────── Main Responder ──
export function getTutorResponse(question) {
  const q = question.toLowerCase().trim();
  if (!q) return "Please type your question! I'm here to help. 😊";

  // Greetings
  if (/^(hi|hello|hey|good morning|good evening|good afternoon|howdy|sup|hii+)/.test(q))
    return "👋 Hey! I'm **ARIS AI Tutor**. Ask me anything about:\n📐 Math · 🔬 Science · 📝 English · 🏛️ History · 🌍 Geography · 💻 Computer\n\nType your question and I'll explain simply! 🎓";

  if (/thank|thanks|thx|ty/.test(q))
    return "😊 You're welcome! Keep asking — every question makes you smarter! 🏆";

  if (/what (is|are) aris|about aris/.test(q))
    return "🤖 **ARIS** = Adaptive Routine Intelligence System\n\nI'm your personal AI tutor + study planner + game! I track your missions, XP, strategy, and answer your doubts 24/7! 📚";

  if (/^(help|what can you do|what do you know)/.test(q))
    return "🆘 **I can help with:**\n\n📐 **Math** — formulas, equations, geometry, algebra\n🔬 **Science** — Newton's laws, chemistry, biology\n📝 **English** — grammar, tenses, parts of speech\n🏛️ **History** — wars, empires, independence\n🌍 **Geography** — maps, continents, climate\n💻 **Computer** — binary, internet, hardware\n\nJust type any question! 🚀";

  if (/who (is|was) you|are you (human|bot|ai|robot)/.test(q))
    return "🤖 I'm ARIS AI Tutor — a smart bot built to help students! I'm not a real AI like ChatGPT, but I know a LOT about your school subjects. Ask me anything! 💡";

  // Try math calculator
  const calcResult = tryMathCalc(q);
  if (calcResult) return calcResult;

  // Search knowledge base
  for (const entry of KB) {
    if (entry.keys.some(k => q.includes(k)))
      return entry.answer;
  }

  // Detect subject and give guidance
  const subject = detectSubject(q);
  if (subject && SUBJECT_ENCOURAGEMENTS[subject])
    return SUBJECT_ENCOURAGEMENTS[subject];

  // Smart generic fallback
  const words = question.trim().split(' ');
  const topic = words.slice(0, 3).join(' ');
  return `🤔 I don't have a specific answer for **"${topic}..."** yet.\n\n💡 **Try asking:**\n• Be more specific: "What is [concept]?"\n• Subject + topic: "Math — how to find LCM?"\n• Use keywords like "formula", "explain", "what is"\n\n📚 My knowledge covers: Math, Science, English, History, Geography, Computer Science.\n\n⭐ Keep asking — every question earns you wisdom! 🎓`;
}

export const QUICK_QUESTIONS = [
  "What is photosynthesis?",
  "Explain Newton's laws",
  "Quadratic formula?",
  "Types of nouns?",
  "What is Pythagoras theorem?",
  "French Revolution summary",
  "7 continents list",
  "Ohm's law formula",
  "DNA and genetics basics",
  "Trigonometry formulas",
  "Profit and loss formula",
  "Active vs passive voice",
];
