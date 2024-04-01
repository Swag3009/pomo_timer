import { useState, useRef } from "react";
import "./App.css";
import bell from "./assets/bell.mp3";

const pomoSuggetions = [
  { focusTime: 25, breakTime: 5 },
  { focusTime: 50, breakTime: 10 },
  { focusTime: 90, breakTime: 30 },
];

function App() {
  const [timer, setTimer] = useState({
    Focus: { minutes: 25, seconds: 0 },
    Break: { minutes: 5, seconds: 0 },
  });
  const timerRef = useRef(timer);
  //2 Timer sates -> Focus, Break
  const [timerState, setTimerState] = useState("Focus");
  let min = timer[timerState].minutes;
  let sec = timer[timerState].seconds;
  //states -> Start, Countdown, Pause
  const [state, setState] = useState("Start");
  const timerCountdown = useRef(null);
  const audio = new Audio(bell);
  const color = {
    Focus: {
      bgColor: "#fdd6db",
      timerBg: "#f85c71",
      btnBg: "#faadb7",
      hover: "#fa8595",
    },
    Break: {
      bgColor: "#cbfcf8",
      timerBg: "#2ff2e1",
      btnBg: "#98f9f0",
      hover: "#63f5e8",
    },
  };

  const suggetionButtons = pomoSuggetions.map((pomodoro, index) => {
    return (
      <button
        key={index}
        style={{
          "--bg-color": color[timerState].btnBg,
          "--bg-hover-color": color[timerState].hover,
        }}
        className="sugButtons"
        onClick={() => {
          let timerObj = {
            Focus: { minutes: pomodoro.focusTime, seconds: 0 },
            Break: { minutes: pomodoro.breakTime, seconds: 0 },
          };
          setTimer(timerObj);
          timerRef.current = timerObj;
          stopTimer();
        }}
      >
        {pomodoro.focusTime}/
        {pomodoro.breakTime < 10
          ? "0" + pomodoro.breakTime.toString()
          : pomodoro.breakTime}
      </button>
    );
  });
  let stateChangingBtn = () => {
    if (state === "Start") return "Start";
    else if (state === "Countdown") return "Pause";
    else if (state === "Pause") return "Restart";
  };
  function handleTimer() {
    if (state == "Start" || state == "Pause") {
      setState("Countdown");
      timerCountdown.current = setInterval(() => {
        setTimer((prevTime) => {
          let min = prevTime[timerState].minutes;
          let sec = prevTime[timerState].seconds;
          if (min === 0 && sec === 0) {
            clearInterval(timerCountdown.current);
            audio.play();
            setState("Start");
            return timerRef.current;
          } else if (sec === 0) {
            return {
              ...prevTime,
              [timerState]: {
                minutes: min - 1,
                seconds: 59,
              },
            };
          } else {
            return {
              ...prevTime,
              [timerState]: {
                ...prevTime[timerState],
                seconds: prevTime[timerState].seconds - 1,
              },
            };
          }
        });
      }, 1000);
    } else if (state == "Countdown") {
      setState("Pause");
      clearInterval(timerCountdown.current);
    }
  }
  function stopTimer() {
    if (timerCountdown.current !== null) {
      clearInterval(timerCountdown.current);
      setState("Start");
      setTimer(timerRef.current);
    }
  }
  return (
    <>
      <div
        className="container"
        style={{ backgroundColor: color[timerState].bgColor }}
      >
        <div className="buttonContainer">{suggetionButtons}</div>
        <div
          className="timerContainer"
          style={{ backgroundColor: color[timerState].timerBg }}
        >
          <h1 id="timer">
            {min < 10 ? "0" + min.toString() : min}:
            {sec < 10 ? "0" + sec.toString() : sec}
          </h1>
          <button
            type="button"
            id="resetButton"
            onClick={handleTimer}
            style={{
              "--bg-color": color[timerState].btnBg,
              "--bg-hover-color": color[timerState].hover,
              boxShadow: "rgba(255,255,255,1) 1.95px 1.95px 2.6px",
            }}
          >
            {stateChangingBtn()}
          </button>
        </div>
        <div
          className="buttonContainer"
          style={({ marginTop: "50px" }, { color: "red" })}
        >
          <button
            className="stateBtn"
            type="button"
            onClick={() => {
              setTimerState("Focus");
              stopTimer();
            }}
            style={{
              "--bg-color": color[timerState].btnBg,
              "--bg-hover-color": color[timerState].hover,
            }}
          >
            Focus
          </button>
          <button
            className="stateBtn"
            type="button"
            onClick={() => {
              setTimerState("Break");
              stopTimer();
            }}
            style={{
              "--bg-color": color[timerState].btnBg,
              "--bg-hover-color": color[timerState].hover,
            }}
          >
            Break
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
