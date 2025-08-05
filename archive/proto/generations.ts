const dayOne = {
  "verse_id": "Genesis 1:1",
  "text": "In the beginning God created the heavens and the earth.",
  "clock": {
    "day": 1,
    "phase": "init",
    "vector_clock": {
      "God": 1,
      "Creation": 1
    }
  },
  "dimensions": {
    "truth": 1.0,
    "justice": 0.2,
    "love": 0.6,
    "chaos": 0.0,
    "order": 1.0,
    "freedom": 0.8,
    "obedience": 0.9,
    "sacrifice": 0.0,
    "life": 1.0,
    "death": 0.0,
    "knowledge": 0.7,
    "power": 0.9
  },
  "intent": ["creation", "initiation", "foundation"],
  "agents": ["God"],
  "entropy": {
    "input": 0.0,
    "output": 0.2
  },
  "comments": [
    "First act of creation sets the base for temporal vector space.",
    "Low entropy indicates beginning of structured system."
  ]
}
// === Types ===
type PersonNode = {
  name: string;
  id: string; // unique identifier
  lineage: string[]; // path from Adam to current
  children?: PersonNode[];
  tribe?: string;
  prophecy?: string;
  role?: string;
};

// === Helper function to make a node ===
const createNode = (
  name: string,
  parentLineage: string[] = [],
  extras: Partial<PersonNode> = {}
): PersonNode => ({
  name,
  id: parentLineage.concat(name).join('/').toLowerCase(),
  lineage: [...parentLineage, name],
  ...extras
});

// === Adam to Jesus (simplified path) ===
const lineageRoot: PersonNode = createNode("Adam", [], {
  children: [
    createNode("Seth", ["Adam"], {
      children: [
        createNode("Enosh", ["Adam", "Seth"], {
          children: [
            // ... more names skipped for brevity ...
            createNode("Noah", ["Adam", "Seth", "Enosh"], {
              children: [
                createNode("Shem", ["Adam", "Seth", "Enosh", "Noah"], {
                  children: [
                    createNode("Eber", ["...", "Shem"], {
                      children: [
                        createNode("Terah", ["...", "Eber"], {
                          children: [
                            createNode("Abraham", ["...", "Terah"], {
                              prophecy: "Covenant bearer",
                              children: [
                                createNode("Isaac", ["...", "Abraham"], {
                                  children: [
                                    createNode("Jacob", ["...", "Isaac"], {
                                      children: [
                                        createNode("Judah", ["...", "Jacob"], {
                                          tribe: "Judah",
                                          prophecy: "Messiah's line"
                                        }),
                                        createNode("Levi", ["...", "Jacob"], {
                                          tribe: "Levi",
                                          role: "Priests"
                                        }),
                                        createNode("Joseph", ["...", "Jacob"], {
                                          tribe: "Ephraim",
                                          role: "Dreamer & Vizier"
                                        })
                                      ]
                                    })
                                  ]
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    })
  ]
});
type GenerationGroup = {
  name: string;
  people: string[];
};

const lineageGroups: GenerationGroup[] = [
  { name: "Abraham to David", people: ["Abraham", "Isaac", "Jacob", ..., "David"] },
  { name: "David to Exile", people: ["Solomon", ..., "Jeconiah"] },
  { name: "Exile to Jesus", people: ["Shealtiel", ..., "Jesus"] }
];
