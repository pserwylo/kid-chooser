import "./animations/chooser-animation-fade.css";
import {
  IChoice, loadChooser,
  recordChoice, selectChooser, selectChooserBySlug,
  selectChosenChoicesForSlug
} from "../../app/choicesSlice.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import ChooserAnimation from "./animations/ChooserAnimation.tsx";
import {AlreadyChosen} from "./AlreadyChosen.tsx";
import {useEffect} from "react";

const Chooser = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {chooserSlug} = useParams<{ chooserSlug: string }>();
  const chooser = useAppSelector(selectChooser);
  const { choice, backupChoice } = useAppSelector(state => selectChosenChoicesForSlug(state, chooserSlug));

  if (!chooserSlug) {
    console.error('Trying to render chooser, but slug doesn\'t exist: ', {chooserSlug})
    navigate("/");
    return;
  }

  useEffect(() => {
    if (chooserSlug) {
      dispatch(loadChooser({ slug: chooserSlug }));
    }
  }, [dispatch, chooserSlug]);

  const handleChoose = (choice: IChoice, backupChoice: IChoice | null) => {
    dispatch(
      recordChoice({
        chooserSlug,
        choiceSlug: choice.slug,
        backupChoiceSlug: backupChoice?.slug,
      })
    );
  };

  if (chooser == null) {
    return null;
  }

  return choice == null
    ? <ChooserAnimation choices={chooser.choices} onChoose={handleChoose} />
    : <AlreadyChosen choice={choice} backupChoice={backupChoice} />;

}

export default Chooser
