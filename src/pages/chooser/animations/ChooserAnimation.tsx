import ChooserAnimationFlicker from "./ChooserAnimationFlicker.tsx";
import {IChoice} from "../../../app/choicesSlice.tsx";
import ChooserAnimationFade from "./ChooserAnimationFade.tsx";
import ChooserAnimationPhysics from "./ChooserAnimationPhysics.tsx";
import randomAnimationType from "./random-animation-type.ts";

export type IChooserAnimationType = 'flicker' | 'fade' | 'physics';

type IProps = {
  choices: IChoice[];
  onChoose: (choice: IChoice, backupChoice: IChoice | null) => void;

  /**
   * If not present, choose one at random.
   */
  type?: IChooserAnimationType;
};

const ChooserAnimation = ({ type, onChoose, choices }: IProps) => {


  if (type === undefined) {
    type = randomAnimationType();
  }

  if (type === 'physics') {
    return <ChooserAnimationPhysics choices={choices} onChoose={onChoose} />;
  } else if (type === 'flicker') {
    return <ChooserAnimationFlicker choices={choices} onChoose={onChoose}/>;
  } else if (type === 'fade') {
    return <ChooserAnimationFade choices={choices} onChoose={onChoose}/>;
  }

  console.error('Unknown animation type: ' + type);
  return null;
};

export default ChooserAnimation;