import {IChoice} from "../../app/choicesSlice.tsx";

const randomChoice = (choices: IChoice[], excludeJokes = false): IChoice => {
  const list = excludeJokes ? choices.filter(c => !c.isJoke) : choices;
  const totalProb = list.reduce((acc, choice) => acc + choice.probability, 0);
  const selectProb = Math.random() * totalProb;
  let sum = 0;
  for (let i = 0; i < choices.length; i++) {
    sum += list[i].probability;
    if (selectProb < sum) {
      return list[i];
    }
  }

  return list[choices.length - 1];
};

export default randomChoice;