import {IChoice} from "../../../app/choicesSlice.tsx";
import {useCallback, useEffect, useState} from "react";
import './chooser-animation-flicker.css';
import clsx from "clsx";
import {NavLink} from "react-router-dom";

type IProps = {
  choices: IChoice[];
  onChoose: (choice: IChoice, backupChoice: IChoice | null) => void;
}

const ChooserAnimationFlicker = ({ choices, onChoose }: IProps) => {
  const [ hasSelected, setHasSelected ] = useState(false);
  const [ nextFlickMs, setNextFlickMs ] = useState(50);
  const [ currentIndex, setCurrentIndex ] = useState(Math.floor(Math.random() * choices.length));

  const choice = choices[currentIndex];

  const nextFlick = useCallback(() => {
    if (nextFlickMs > 800) {
      onChoose(choice, null);
      setHasSelected(true);
    } else {
      setNextFlickMs(nextFlickMs * 1.3);
      setCurrentIndex((currentIndex + 1) % choices.length);
    }
  }, [nextFlickMs, currentIndex, choices.length, choice, onChoose]);

  useEffect(() => {
    nextFlick();
  }, []);

  useEffect(() => {
    setTimeout(nextFlick, nextFlickMs);
  }, [nextFlickMs, nextFlick])

  return (
    <div className="chooser-animation chooser-animation-flicker">
      <div className={clsx('chooser-animation-choice', { 'chooser-animation-choice--selected': hasSelected })}>
        {choice.label}{hasSelected && '!'} {choice.emoji}
      </div>
      {hasSelected && <NavLink to="/">Back</NavLink>}
    </div>
  );
};

export default ChooserAnimationFlicker;