import { DBSchema, openDB } from "idb";

export type ChooserDTO = {
  slug: string;
  label: string;
  description: string;
  choices: ChoiceDTO[];
}

export type ChoiceDTO = {
  slug: string;
  label: string;
  emoji: string;
  probability: number;
  isJoke?: boolean;
}

interface ChooserDB extends DBSchema {
  choosers: {
    key: string;
    value: ChooserDTO;
  };
}

export const getDB = async () => {
  const db = await openDB<ChooserDB>("db", 1, {
    upgrade(d, oldVersion) {
      try {
        if (oldVersion < 1) {
          const choosers = d.createObjectStore("choosers", {
            keyPath: "slug",
            autoIncrement: false,
          });

          initialChoosers.forEach((chooser) => {
            console.info("Creating chooser: ", { chooser })
            choosers.put(chooser);
          })
        }
      } catch (e) {
        console.error(e);
      }
    },
  });

  return db;
};

const initialChoosers: ChooserDTO[] = [
  {
    slug: 'bathing',
    label: 'Bathing',
    description: '',
    choices:
        [
          {
            slug: "shower",
            label: "Shower",
            emoji: "🚿",
            probability: 1,
          },
          {
            slug: "bath",
            label: "Bath",
            emoji: "🛁",
            probability: 1,
          },
        ]
  },
  {
    slug: 'breakfast',
    label: 'Breakfast',
    description: '',
    choices:
        [
          {
            slug: "cereal",
            label: "Cereal",
            emoji: "🥣🌾",
            probability: 1,
          },
          {
            slug: "fruit",
            label: "Fruit",
            emoji: "🍏🍌",
            probability: 1,
          },
          {
            slug: "toast",
            label: "Toast",
            emoji: "🍞",
            probability: 1,
          },
          {
            slug: "yoghurt",
            label: "Yoghurt",
            emoji: "🥄⚪",
            probability: 1,
          },
        ]
  }
];