import {IChoice} from "../../../app/choicesSlice.tsx";
import {useEffect, useState} from "react";
import './chooser-animation-flicker.css';
import clsx from "clsx";
import {Container} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import randomChoice from "../randomChoice.ts";

type IProps = {
  choices: IChoice[];
  onChoose: (choice: IChoice) => void;
}

const ChooserAnimationFlicker = ({ choices, onChoose }: IProps) => {
  const [ hasSelected, setHasSelected ] = useState(false);
  const [ choice ] = useState(randomChoice(choices));

  useEffect(() => {
    setTimeout(() => {
      setHasSelected(true);
      onChoose(choice);
    }, 3000); // Intentionally a bit shorter than the CSS animation because the last bit of that oesn't do much.
  }, []);

  return (
    <Container className={clsx('chooser-animation-fade')}>
      <div className="chooser-animation-fade--wrapper">
        <h1>{choice.label} {choice.emoji}</h1>
        {/*{backupChoice != null && <p>Just kidding, it's {backupChoice.label} {backupChoice.emoji}!</p>}*/}
      </div>
      {hasSelected && <NavLink to="/">Back</NavLink>}
    </Container>
  );
};

export default ChooserAnimationFlicker;