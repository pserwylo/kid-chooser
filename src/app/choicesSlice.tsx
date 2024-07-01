import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type IChooser = {
  slug: string;
  label: string;
  description: string;
  choices: IChoice[];
}

export type IChoice = {
  slug: string;
  label: string;
  emoji: string;
  probability: number;
  isJoke?: boolean;
}

const choicesSlice = createSlice({
  name: 'choices',
  initialState: {
    chosenChoices: [] as { chooserSlug: string, choiceSlug: string, backupChoiceSlug?: string }[],
    choosers: [
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
              probability: 0.7,
            },
            {
              slug: "bath",
              label: "Bath",
              emoji: "🛁",
              probability: 0.3,
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
              emoji: "🥣",
              probability: 0.5,
            },
            {
              slug: "fruit",
              label: "Fruit",
              emoji: "🍏🍒🍐🍌🍓🍊🥝🍉",
              probability: 0.5,
            },
            {
              slug: "yoghurt",
              label: "Yoghurt",
              emoji: "🥣",
              probability: 4,
            },
          ]
      }
    ] as IChooser[],
  },
  reducers: {
    recordChoice: (state, action: PayloadAction<{ chooserSlug: string, choiceSlug: string, backupChoiceSlug?: string }>) => {
      const { chooserSlug, choiceSlug, backupChoiceSlug } = action.payload;
      const chooser = choicesSlice.getSelectors().selectChooserBySlug(state, chooserSlug);
      if (!chooser) {
        throw new Error('Could not find chooser: ' + chooserSlug);
      }

      const choice = chooser.choices.find((choice) => choice.slug === choiceSlug);
      if (!choice) {
        throw new Error('Could not find choice: ' + choiceSlug + ' in chooser: ' + chooserSlug);
      }

      if (backupChoiceSlug) {
        const backupChoice = chooser.choices.find((choice) => choice.slug === backupChoiceSlug);
        if (!backupChoice) {
          throw new Error('Could not find backup choice: ' + backupChoiceSlug + ' in chooser: ' + chooserSlug);
        }
      }

      state.chosenChoices = state.chosenChoices.filter((item) => item.chooserSlug !== chooserSlug).concat({
        chooserSlug,
        choiceSlug,
        backupChoiceSlug,
      });
    },
  },
  selectors: {
    selectChoosers: (sliceState) => sliceState.choosers,
    selectChooserBySlug: (sliceState, slug) => sliceState.choosers.find(c => c.slug === slug),
    selectChosenChoicesForSlug: (sliceState, chooserSlug) => {
      const chooser = choicesSlice.getSelectors().selectChooserBySlug(sliceState, chooserSlug);
      const choices = sliceState.chosenChoices.find(c => c.chooserSlug === chooserSlug);
      if (choices == null) {
        return nullChoice;
      }

      return {
        choice: chooser?.choices?.find(c => c.slug === choices.choiceSlug) ?? null,
        backupChoice: chooser?.choices?.find(c => c.slug === choices.backupChoiceSlug) ?? null,
      };
    },
  },
})

const nullChoice = {
  choice: null,
  backupChoice: null,
};

export const {
  selectChoosers,
  selectChooserBySlug,
  selectChosenChoicesForSlug,
} = choicesSlice.selectors;

export const {
  recordChoice,
} = choicesSlice.actions;

export default choicesSlice;