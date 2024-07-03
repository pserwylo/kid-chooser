import {Button, Card, CardBody, CardFooter, Col, Container, Row} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import {IChooser, selectChoosers, selectChosenChoicesForSlug} from "../app/choicesSlice.tsx";
import {useAppSelector} from "../app/hooks.ts";
import './splash.css'

const Splash = () => {

  const choosers = useAppSelector(selectChoosers);

  return (<Container>
    <Row className="splash-cards">
      {choosers.map(chooser => (<Col md={6} lg={4} key={chooser.slug}>
        <ChooserCard chooser={chooser} />
        </Col>))}
    </Row>
  </Container>);
}

type IChooserCardProps = {
  chooser: IChooser;
}

const ChooserCard = ({ chooser }: IChooserCardProps) => {

  const { choice, backupChoice } = useAppSelector(state => selectChosenChoicesForSlug(state, chooser.slug));

  return (
    <Card className="splash-card">
      <CardBody>
        {choice != null ? (
          <>
            <div className="choice choice-chosen">{choice.label} {choice.emoji}</div>
            {backupChoice && <div className="choice choice-backup choice-chosen">Just kidding, it's {choice.label} {choice.emoji}</div>}
          </>
        ) : (
          <>
            {chooser.choices.map(option => <div key={option.label} className="choice">{option.label} {option.emoji}</div>)}
          </>
        )}
      </CardBody>
      <CardFooter>
        {choice == null ? (
          <LinkContainer to={`/choose/${chooser.slug}`}>
            <Button>Help me choose!</Button>
          </LinkContainer>
        ) : (
          <div className="choice-already-chosen">Already chosen. Choose again tomorrow.</div>
        )}
      </CardFooter>
    </Card>
  );
};

export default Splash;
