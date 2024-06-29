import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Card, CardBody, CardFooter, CardTitle, Col, Container, Row} from "react-bootstrap";
import {useState} from "react";

type IChoice = {
  label: string;
  emoji: string;
  probability: number;
}

const choices: IChoice[] = [
  {
    label: "Shower",
    emoji: "🚿",
    probability: 0.7,
  },
  {
    label: "Bath",
    emoji: "🛁",
    probability: 0.3,
  },
  {
    label: "Wash in the toilet",
    emoji: "🚽💩",
    probability: 0,
  }
]

type Screen = 'splash' | 'chooser';

const randomChoice = (choices: IChoice[]): IChoice => {
  const totalProb = choices.reduce((acc, choice) => acc + choice.probability, 0);
  const selectProb = Math.random() * totalProb;
  let sum = 0;
  for (let i = 0; i < choices.length; i ++) {
    sum += choices[i].probability;
    if (selectProb < sum) {
      return choices[i];
    }
  }

  return choices[choices.length - 1];
};

function App() {

  const [ choice ] = useState<IChoice>(randomChoice(choices));
  const [ screen, setScreen ] = useState<Screen>('splash');

  return (
    <div className="app">
      {screen == 'splash' && (
        <Container>
          <Row>
            <Col md={4}>
              <Splash onChoose={() => setScreen('chooser')} />
            </Col>
          </Row>
        </Container>
      )}

      {screen == 'chooser' && (
        <Chooser choice={choice} allChoices={choices} />
      )}
    </div>
  )
}

type ISplashProps = {
  onChoose: () => void;
}

const Splash = ({ onChoose }: ISplashProps) => {
  return (
    <Card>
      <CardBody>
        <CardTitle>Which one?</CardTitle>
        {choices.map(option =>
          <div key={option.label} className="choice">{option.label} {option.emoji}</div>
        )}
      </CardBody>
      <CardFooter>
        <Button onClick={() => onChoose()}>Choose</Button>
      </CardFooter>
    </Card>
  );
}

type IChooserProps = {
  choice: IChoice;
  allChoices: IChoice[];
};

const Chooser = ({ choice }: IChooserProps) => {
  return (
    <Container>
      <h1>{choice.label} {choice.emoji}</h1>
    </Container>
  )
}

export default App
