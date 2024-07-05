import ChooserAnimationFlicker from "./ChooserAnimationFlicker.tsx";
import {IChoice} from "../../../app/choicesSlice.tsx";
import ChooserAnimationFade from "./ChooserAnimationFade.tsx";

export type IChooserAnimationType = 'flicker' | 'fade';

type IProps = {
  choices: IChoice[];
  onChoose: (choice: IChoice, backupChoice: IChoice | null) => void;

  /**
   * If not present, choose one at random.
   */
  type?: IChooserAnimationType;
};

const allAnimationTypes: IChooserAnimationType[] = [ 'flicker', 'fade' ];

export const randomAnimationType = (): IChooserAnimationType => {
  const index = Math.floor(Math.random() * allAnimationTypes.length);
  return allAnimationTypes[index];
}

const ChooserAnimation = ({ type, onChoose, choices }: IProps) => {

  if (type === undefined) {
    type = randomAnimationType();
  }

  if (type === 'flicker') {
    return <ChooserAnimationFlicker choices={choices} onChoose={onChoose}/>;
  } else if (type === 'fade') {
    return <ChooserAnimationFade choices={choices} onChoose={onChoose}/>;
  }

  console.error('Unknown animation type: ' + type);
  return null;
};

export default ChooserAnimation;