import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ChooserDTO, getDB} from "./db.ts";

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

export const loadChoosers = createAsyncThunk<void>(
    "choices/loadChoosers",
    async (_: void, { dispatch }) => {
      const db = await getDB();
      const choosers = await db.getAll("choosers");

      dispatch(choicesSlice.actions.initChoosers(choosers));
    },
);

export const loadChooser = createAsyncThunk(
  "choices/loadChooser",
  async (args: { slug: string }, { dispatch }) => {
    const { slug } = args;
    const db = await getDB();
    const chooser = await db.get("choosers", slug);

    dispatch(choicesSlice.actions.initChooser(chooser));
  },
);

const choicesSlice = createSlice({
  name: 'choices',
  initialState: {
    chosenChoices: [] as { chooserSlug: string, choiceSlug: string, backupChoiceSlug?: string }[],
    choosers: [] as ChooserDTO[],
    chooser: null as ChooserDTO | null
  },
  reducers: {
    initChoosers: (state, action: PayloadAction<ChooserDTO[]>) => {
      state.choosers = action.payload;
    },
    initChooser: (state, action: PayloadAction<ChooserDTO>) => {
      state.chooser = action.payload;
    },
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
    selectChooser: (sliceState) => sliceState.chooser,
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
  selectChooser,
  selectChoosers,
  selectChooserBySlug,
  selectChosenChoicesForSlug,
} = choicesSlice.selectors;

export const {
  recordChoice,
} = choicesSlice.actions;

export default choicesSlice;