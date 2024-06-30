import {Button, Card, CardBody, CardFooter, CardTitle, Col, Container, Row} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import {useSelector} from "react-redux";
import {selectChoosers} from "../app/choicesSlice.tsx";

const Splash = () => {

  const choosers = useSelector(selectChoosers);

  const onChoose = () => {

  }

  return (<Container>
    <Row>
      {choosers.map(chooser => (<Col md={4} key={chooser.slug}>
        <Card key={chooser.slug}>
          <CardBody>
            <CardTitle>Which one?</CardTitle>
            {chooser.choices.map(option => <div key={option.label}
                                                className="choice">{option.label} {option.emoji}</div>)}
          </CardBody>
          <CardFooter>
            <LinkContainer to={`/choose/${chooser.slug}`}>
              <Button onClick={() => onChoose()}>Choose</Button>
            </LinkContainer>
          </CardFooter>
        </Card></Col>))}
    </Row>
  </Container>);
}

export default Splash;
