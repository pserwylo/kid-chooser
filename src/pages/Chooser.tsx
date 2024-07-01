import "./chooser.css";
import {Container} from "react-bootstrap";
import {
  IChoice,
  recordChoice, selectChooserBySlug,
  selectChosenChoicesForSlug
} from "../app/choicesSlice.tsx";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import clsx from "clsx";

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

const Chooser = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {chooserSlug} = useParams<{ chooserSlug: string }>();
  const chooser = useAppSelector(state => selectChooserBySlug(state, chooserSlug));
  const { choice, backupChoice } = useAppSelector(state => selectChosenChoicesForSlug(state, chooserSlug));
  const [ hasAlreadyChosen ] = useState(choice != null);

  useEffect(() => {
    if (choice != null) {
      return;
    }

    if (chooser == null) {
      return;
    }

    const newChoice = randomChoice(chooser.choices);
    const newBackupChoice = newChoice.isJoke ? randomChoice(chooser.choices, true) : null;

    dispatch(recordChoice({
      chooserSlug: chooser.slug,
      choiceSlug: newChoice.slug,
      backupChoiceSlug: newBackupChoice?.slug
    }));

  }, [chooser, choice, dispatch]);

  if (!chooser) {
    navigate("/");
    return;
  }

  if (choice == null) {
    return null;
  }

  return (
    <Container className={clsx('chooser-root', { 'fade-in': !hasAlreadyChosen })}>
      {hasAlreadyChosen && <p>You've already chosen:</p>}
      <h1>{choice.label} {choice.emoji}</h1>

      {backupChoice != null && <p>Just kidding, it's {backupChoice.label} {backupChoice.emoji}!</p>}

      <NavLink to="/">Back</NavLink>
    </Container>
  )
}

export default Chooser
