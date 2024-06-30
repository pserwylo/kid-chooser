import {Container} from "react-bootstrap";
import {IChoice, selectChoosers} from "../app/choicesSlice.tsx";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";

const randomChoice = (choices: IChoice[], excludeJokes = false): IChoice => {
  const list = excludeJokes ? choices.filter(c => !c.isJoke) : choices;
  const totalProb = list.reduce((acc, choice) => acc + choice.probability, 0);
  const selectProb = Math.random() * totalProb;
  let sum = 0;
  for (let i = 0; i < choices.length; i++) {
    sum += choices[i].probability;
    if (selectProb < sum) {
      return choices[i];
    }
  }

  return choices[choices.length - 1];
};

const Chooser = () => {

  const {chooserSlug} = useParams<{ chooserSlug: string }>();

  const chooser = useSelector(selectChoosers).find(c => c.slug === chooserSlug);
  const navigate = useNavigate();

  if (!chooser) {
    navigate("/");
    return;
  }

  const choice = randomChoice(chooser.choices);
  const backupChoice = choice.isJoke ? randomChoice(chooser.choices, true) : null;

  return (
    <Container>
      <h1>{choice.label} {choice.emoji}</h1>
      {backupChoice != null && <p>Just kidding, it's {backupChoice.label} {backupChoice.emoji}!</p>}

      <NavLink to="/">Back</NavLink>

    </Container>
  )
}

export default Chooser
