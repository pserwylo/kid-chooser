import {createSlice} from "@reduxjs/toolkit";

export type IChooser = {
  slug: string;
  label: string;
  description: string;
  choices: IChoice[];
}

export type IChoice = {
  label: string;
  emoji: string;
  probability: number;
  isJoke?: boolean;
}

const choicesSlice = createSlice({
  name: 'choices',
  initialState: {
    choosers: [
      {
        slug: 'bathing',
        label: 'Bathing',
        description: '',
        choices:
          [
            {
              label: "Shower",
              emoji: "🚿",
              probability: 0.7,
            },
            {
              label: "Bath",
              emoji: "🛁",
              probability: 0.3,
            },
            {
              label: "Wash in the toilet",
              emoji: "🚽💩",
              probability: 1,
              isJoke: true,
            }
          ]
      },
      {
        slug: 'breakfast',
        label: 'Breakfast',
        description: '',
        choices:
          [
            {
              label: "Cereal",
              emoji: "🥣",
              probability: 0.5,
            },
            {
              label: "Fruit",
              emoji: "🍏🍒🍐🍌🍓🍊🥝🍉",
              probability: 0.5,
            },
            {
              label: "Yoghurt",
              emoji: "🥣",
              probability: 4,
            },
            {
              label: "Poo Smoothies",
              emoji: "🧋💩",
              probability: 10,
              isJoke: true,
            }
          ]
      }
    ] as IChooser[],
  },
  reducers: {

  },
  selectors: {
    selectChoosers: (sliceState) => sliceState.choosers,
  },
})

export const {
  selectChoosers,
} = choicesSlice.selectors;

export default choicesSlice;