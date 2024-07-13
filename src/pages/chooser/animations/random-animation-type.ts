import {IChooserAnimationType} from "./ChooserAnimation.tsx";

// const allAnimationTypes: IChooserAnimationType[] = [ 'flicker', 'fade', 'physics' ];

const randomAnimationType = (): IChooserAnimationType => {
  return 'physics';
  /*const index = Math.floor(Math.random() * allAnimationTypes.length);
  return allAnimationTypes[index];*/
}

export default randomAnimationType;
