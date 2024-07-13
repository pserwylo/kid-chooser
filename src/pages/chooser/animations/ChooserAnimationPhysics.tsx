import {IChoice} from "../../../app/choicesSlice.tsx";
import {useEffect, useRef} from "react";
import './chooser-animation-physics.css';
import bgUrl from '../../../assets/images/bg.avif';
import bucketBlueUrl from '../../../assets/images/bucket.blue.png';
import bucketGreenUrl from '../../../assets/images/bucket.green.png';
import bucketOrangeUrl from '../../../assets/images/bucket.orange.png';
import bucketPinkUrl from '../../../assets/images/bucket.pink.png';
import bucketRedUrl from '../../../assets/images/bucket.red.png';
import bucketYellowUrl from '../../../assets/images/bucket.yellow.png';
import {Bodies, Body, Composite, Engine, Events, IEventCollision, Vector} from "matter-js";

const createWorld = (choices: IChoice[], width: number, height: number, initialBallVelocity: Vector, initialBallPosition: Vector) => {
  const engine = Engine.create();

  engine.gravity.y = 0.5;

  const NUM_FUNNELS = choices.length;

  const BALL_WIDTH = Math.min(
    80, // Even on big screens, don't go too large...
    width / 10, // A nice size to have...
    width / (NUM_FUNNELS * 2), // But if there is heaps of choices, make sure the ball will still fit in the funnels.
  );

  const ballPos = Vector.clone(initialBallPosition);
  ballPos.y += BALL_WIDTH;
  const ball = Bodies.circle(width / 3, BALL_WIDTH, BALL_WIDTH / 2, {
    force: initialBallVelocity,
    position: ballPos,
    restitution: 0.999,
    mass: 2,
    friction: 0,
    label: 'ball',
  });

  const walls = [
    Bodies.rectangle(2, 2, width * 2, 4, {isStatic: true}),
    Bodies.rectangle(2, height / 2, 4, height, {isStatic: true}),
    Bodies.rectangle(width - 2, height / 2, 4, height, {isStatic: true}),
  ];

  const FUNNEL_WIDTH = width / NUM_FUNNELS;
  const RAMP_WIDTH = (FUNNEL_WIDTH - (BALL_WIDTH * 1.2)) / 2
  const RAMP_HEIGHT = Math.min(RAMP_WIDTH / 4, BALL_WIDTH * 0.8);
  const FUNNEL_THICKNESS = 6;
  const FUNNEL_START_Y = height - BALL_WIDTH * 4
  const funnels: Body[] = [];
  const buckets: Body[] = [];

  for (let i = 0; i < NUM_FUNNELS; i ++) {

    const choice = choices[i];
    const top = FUNNEL_START_Y;
    const bottom = FUNNEL_START_Y + RAMP_HEIGHT;
    const left = i * FUNNEL_WIDTH;
    const openingLeft = left + RAMP_WIDTH;
    const openingRight = left + FUNNEL_WIDTH - RAMP_WIDTH;
    const right = left + FUNNEL_WIDTH;

    buckets.push(
      Bodies.rectangle(
        openingLeft + (openingRight - openingLeft) / 2,
        bottom + BALL_WIDTH * 2,
        openingRight - openingLeft,
        4,
        { isStatic: true, isSensor: true, label: choice.slug }
      )
    );

    funnels.push(
      Bodies.fromVertices(left + RAMP_WIDTH / 2, top + RAMP_HEIGHT / 2, [[
        Vector.create(left, top),
        Vector.create(openingLeft, bottom),
        Vector.create(openingLeft, bottom + FUNNEL_THICKNESS),
        Vector.create(left, top + FUNNEL_THICKNESS),
      ]], { isStatic: true, friction: 0 })
    )

    walls.push(
      Bodies.rectangle(openingLeft, bottom + BALL_WIDTH, 3, BALL_WIDTH * 2, { isStatic: true })
    );

    walls.push(
      Bodies.rectangle(openingRight, bottom + BALL_WIDTH, 3, BALL_WIDTH * 2, { isStatic: true })
    )

    funnels.push(
      Bodies.fromVertices(openingRight + RAMP_WIDTH / 2, top + RAMP_HEIGHT / 2, [[
        Vector.create(openingRight, bottom),
        Vector.create(right, top),
        Vector.create(right, top + FUNNEL_THICKNESS),
        Vector.create(openingRight, bottom + FUNNEL_THICKNESS),
      ]], { isStatic: true, friction: 0 })
    )
  }

  const pins: Body[] = []
  const PIN_WIDTH = BALL_WIDTH / 5;
  const NUM_X = width / (PIN_WIDTH + BALL_WIDTH) - 3;
  const NUM_Y = height / (PIN_WIDTH + BALL_WIDTH) - 4;
  const widthSpace = width / (NUM_X + 1);
  const heightSpace = height / (NUM_Y + 1);
  for (let y = 2; y < NUM_Y - 3; y ++) {
    const xOffset = y % 2 == 0 ? widthSpace : widthSpace / 2;
    const xForRow = y % 2 == 0 ? NUM_X : NUM_X + 1;
    for (let x = 0; x < xForRow; x ++) {
      pins.push(Bodies.circle(xOffset + x * widthSpace, y * heightSpace, BALL_WIDTH / 10, {isStatic: true}))
    }
  }

  // add all of the bodies to the world
  Composite.add(engine.world, [ball, ...pins, ...walls, ...funnels, ...buckets]);

  return {
    engine,
    ball,
    pins,
    walls,
    funnels,
    buckets,
  };
}

const isCollisionBetweenBallAndBucket = (event: IEventCollision<Engine>, choices: IChoice[], ball: Body, buckets: Body[]) => {
  const bodyA = event.pairs[0].bodyA;
  const bodyB = event.pairs[0].bodyB;

  if (bodyA !== ball && bodyA !== ball) {
    return null;
  }

  const bucketIndex = buckets.findIndex(b => b === bodyA || b === bodyB )
  if (bucketIndex === -1) {
    return null;
  }

  return choices[bucketIndex];
}

const simulateWorld = (choices: IChoice[], width: number, height: number) => {
  const initialBallVelocity = Vector.create((Math.random() - 0.3) * 0.3);
  const initialBallPosition = Vector.create(Math.random() * width);

  const headlessWorld = createWorld(choices, width, height, initialBallVelocity, initialBallPosition);
  let selectedChoice: IChoice | null = null;

  const callback = Events.on(headlessWorld.engine, 'collisionStart', event => {
    selectedChoice = isCollisionBetweenBallAndBucket(event, choices, headlessWorld.ball, headlessWorld.buckets);
  })

  // Run simulation headless to find out where the ball will land, so we can put the choices in the right place
  // after weighting them appropriately.
  const startTime = new Date().getTime();
  const maxIterations = 10000;
  const maxDurationMs = 1000;
  let iterations;
  for (iterations = 0; iterations < maxIterations; iterations ++) {
    Engine.update(headlessWorld.engine);
    const durationMs = new Date().getTime() - startTime;

    if (selectedChoice != null) {
      console.log("Selected bucket: " + (selectedChoice as IChoice).label);
      break;
    }

    if (durationMs > maxDurationMs) {
      console.warn("Simulation exceeded the max allotted " + maxDurationMs + "ms.");
      break;
    }
  }
  const durationMs = new Date().getTime() - startTime;
  console.log(`Ran ${iterations} iterations in ${durationMs} ms (${durationMs / iterations}ms per iteration.`);

  Events.off(headlessWorld.engine, 'collisionStart', callback);

  if (selectedChoice == null) {
    return null;
  }

  return createWorld(choices, width, height, initialBallVelocity, initialBallPosition);
}

type IProps = {
  choices: IChoice[];
  onChoose: (choice: IChoice, backupChoice: IChoice | null) => void;
}

const ChooserAnimationPhysics = ({choices, onChoose}: IProps) => {
  const requestRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine|null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    let world = simulateWorld(choices, width, height);
    while (world == null) {
      world = simulateWorld(choices, width, height);
    }
    engineRef.current = world.engine;

    Events.on(world.engine, 'collisionStart', (event) => {
      const choice = isCollisionBetweenBallAndBucket(event, choices, world.ball, world.buckets);
      if (choice != null) {
        console.log("CHOSE " + choice.label);
        onChoose(choice, null);
      }
    });

    const bucketImages: HTMLImageElement[] = Array.from(document.querySelectorAll('.bucket-image')) as HTMLImageElement[];

    (function rerender() {

      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(0, 0, 0, 1)'

      const renderCircle = (circle: Body) => {
        ctx.save();
        ctx.translate(circle.position.x, circle.position.y);
        ctx.rotate(circle.angle * 180 / Math.PI);
        ctx.beginPath()
        ctx.arc(0, 0, circle.circleRadius!, 0, Math.PI * 2);
        ctx.fill()
        ctx.stroke()
        ctx.restore();
      }

      const drawPoly = (poly: Body) => {
        ctx.beginPath()
        ctx.moveTo(poly.vertices[0].x, poly.vertices[0].y);
        for (let i = 1; i < poly.vertices.length; i ++) {
          ctx.lineTo(poly.vertices[i].x, poly.vertices[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      ctx.fillStyle = 'rgb(200, 255, 200)'
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(65,65,65)';
      renderCircle(world.ball);

      ctx.fillStyle = 'rgb(150, 150, 150)'
      ctx.strokeStyle = 'rgb(0, 0, 0)';
      world.pins.forEach(p => renderCircle(p));

      ctx.fillStyle = 'rgb(150, 150, 150)'
      ctx.strokeStyle = 'rgb(0, 0, 0, 1)'
      ctx.lineWidth = 2;
      world.funnels.forEach(w => drawPoly(w))

      ctx.font = `${world.ball.circleRadius! * 1.5}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      choices.forEach((choice, i) => {
        const bucket = world.buckets[i];
        const size = world.ball.circleRadius!;
        ctx.drawImage(bucketImages[i], bucket.position.x - size * 2.5, bucket.position.y - size * 3, size * 5, size * 5);

        ctx.fillStyle = 'rgba(0, 0, 0, 1)'
        ctx.fillText(choice.emoji, bucket.position.x, bucket.position.y - size * 0.5);
      })

      Engine.update(world.engine);
      requestRef.current = requestAnimationFrame(rerender);
    })();

    return () => {
      cancelAnimationFrame(requestRef.current);
      Composite.clear(world.engine.world, false, true);
      Engine.clear(world.engine);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url('${bgUrl}')`,
        backgroundSize: 'cover',
        opacity: 0.3,
      }}/>
      <canvas ref={canvasRef} className="chooser-animation-physics" style={{position: 'absolute', inset: 0}}/>
      <img className="bucket-image" src={bucketBlueUrl} style={{display: 'none'}}/>
      <img className="bucket-image" src={bucketGreenUrl} style={{display: 'none'}}/>
      <img className="bucket-image" src={bucketOrangeUrl} style={{display: 'none'}}/>
      <img className="bucket-image" src={bucketPinkUrl} style={{display: 'none'}}/>
      <img className="bucket-image" src={bucketRedUrl} style={{display: 'none'}}/>
      <img className="bucket-image" src={bucketYellowUrl} style={{display: 'none'}}/>
    </div>
  );
};

export default ChooserAnimationPhysics;