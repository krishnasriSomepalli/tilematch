import React from "react";
import "./styles.css";

const Tile = props => (
  <div className="TileDiv">
    <img
      src={props.src}
      alt=""
      className="TileImg"
      style={{
        opacity:
          props.tileStatus === "hidden"
            ? "0"
            : props.tileStatus === "visible"
            ? "1"
            : "0.5"
      }}
      onClick={event =>
        props.handleClick(event, props.tileNumber, props.isVisible)
      }
    />
  </div>
);

const Game = props => {
  const tileData = images;
  const tileMap = props.tileMap;
  const [visible, setVisible] = React.useState([]);
  const [completed, setCompleted] = React.useState([]);
  const [score, setScore] = React.useState(0);
  const [secondsLeft, setSecondsLeft] = React.useState(20);
  const [message, setMessage] = React.useState(
    "Start clicking on tiles to find matches. You can only see at most 2 tiles at a time"
  );

  React.useEffect(() => {
    if (visible.length === 2) {
      if (visible.length === 2 && tileMap[visible[0]] === tileMap[visible[1]]) {
        setCompleted(completed.concat(visible));
      }
    }
  }, [visible]);

  React.useEffect(() => {
    if (visible.length === 2 && tileMap[visible[0]] === tileMap[visible[1]]) {
      setVisible([]);
    }
    setScore(completed.length * 6.25);
  }, [completed]);

  React.useEffect(() => {
    if (secondsLeft > 0 && completed.length < 16) {
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
    if (completed.length === 16 && secondsLeft > 0) setMessage("You won! :D");
    if (secondsLeft === 0) {
      setMessage("You lost :(");
    }
  });

  const onTileClick = (event, tileNumber, isVisible) => {
    if (completed.includes(tileNumber) || secondsLeft === 0) return;
    if (isVisible) {
      event.target.style.opacity = 0;
      setVisible(visible.filter(visibleTile => visibleTile !== tileNumber));
      setMessage("...");
    } else {
      if (visible.length < 2) {
        event.target.style.opacity = 1;
        setVisible(visible.concat(tileNumber));
        setMessage("...");
      } else {
        setMessage("Close one of the open tiles.");
      }
    }
  };

  const tileStatus = tileNumber => {
    if (completed.includes(tileNumber)) return "completed";
    if (visible.includes(tileNumber)) return "visible";
    return "hidden";
  };

  return (
    <>
      <div className="Tiles">
        {utils.range(0, 15).map(id => (
          <Tile
            key={id}
            src={tileData[tileMap[id]]}
            handleClick={onTileClick}
            tileNumber={id}
            isVisible={visible.includes(id)}
            tileStatus={tileStatus(id)}
          />
        ))}
      </div>
      <div className="Params" style={{}}>
        <p>
          Score: <span style={{ fontWeight: "700" }}>{score}</span>
        </p>
        <p>
          Time: <span style={{ fontWeight: "700" }}>{secondsLeft}</span>
        </p>
      </div>
      <p
        className="Message"
        style={{ visibility: message === "none" ? "hidden" : "visible" }}
      >
        {message}
      </p>
      <button className="Button" onClick={props.startNewGame}>
        {secondsLeft === 0 ? "Replay?" : "Restart?"}
      </button>
    </>
  );
};

export default function App() {
  const tileMap = utils.random(0, 15).map(tileKey => tileKey % 8);
  const [gameId, setGameId] = React.useState(0);

  return (
    <div className="App">
      <h3 style={{ marginTop: "-20px" }}>Tile Match</h3>
      <Game
        tileMap={tileMap}
        key={gameId}
        startNewGame={() => setGameId(gameId + 1)}
      />
    </div>
  );
}

const images = [
  "https://image.flaticon.com/icons/svg/389/389079.svg",
  "https://image.flaticon.com/icons/svg/389/389101.svg",
  "https://image.flaticon.com/icons/svg/389/389087.svg",
  "https://image.flaticon.com/icons/svg/389/389026.svg",
  "https://image.flaticon.com/icons/svg/389/389060.svg",
  "https://image.flaticon.com/icons/svg/389/389074.svg",
  "https://image.flaticon.com/icons/svg/389/389091.svg",
  "https://image.flaticon.com/icons/svg/389/389056.svg"
];

const utils = {
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),
  random: (min, max) =>
    Array.from({ length: max - min + 1 }, (_, i) => min + i).sort(
      () => Math.random() - 0.5
    )
};
