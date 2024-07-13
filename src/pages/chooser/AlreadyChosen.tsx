import "./already-chosen.css"
import {IChoice} from "../../app/choicesSlice.tsx";
import {Link} from "react-router-dom";

type IProps = {
  choice: IChoice;
  backupChoice: IChoice | null;
}

export const AlreadyChosen = ({ choice, backupChoice }: IProps) => {
  return (
    <div className="chooser-choice">
      <div className="chooser-choice-selected">
        {choice.label}!
        <br />
        {choice.emoji}
      </div>
      {backupChoice && <div className="chooser-choice-backup">
        Just kidding... {backupChoice.label}! {backupChoice.emoji}
      </div>}
      <Link to="/">Back</Link>
    </div>
  );
};