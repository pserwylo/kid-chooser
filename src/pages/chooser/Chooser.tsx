import "./animations/chooser-animation-fade.css";
import {
  IChoice,
  recordChoice, selectChooserBySlug,
  selectChosenChoicesForSlug
} from "../../app/choicesSlice.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import ChooserAnimation from "./animations/ChooserAnimation.tsx";
import {AlreadyChosen} from "./AlreadyChosen.tsx";

const Chooser = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {chooserSlug} = useParams<{ chooserSlug: string }>();
  const chooser = useAppSelector(state => selectChooserBySlug(state, chooserSlug));
  const { choice, backupChoice } = useAppSelector(state => selectChosenChoicesForSlug(state, chooserSlug));

  if (!chooser || !chooserSlug) {
    console.error('Trying to render chooser, but slug doesn\'t exist: ', {chooser, chooserSlug})
    navigate("/");
    return;
  }

  const handleChoose = (choice: IChoice) => {
    dispatch(
      recordChoice({
        chooserSlug,
        choiceSlug: choice.slug,
      })
    );
  };

  return choice == null
    ? <ChooserAnimation choices={chooser.choices} onChoose={handleChoose} />
    : <AlreadyChosen choice={choice} />;

}

export default Chooser
