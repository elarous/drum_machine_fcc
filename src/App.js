import React, { Component } from 'react';
import posed from 'react-pose';
import './App.css';

const Button = posed.div({
  normal: {transform: "scale(1)"},
  playing: {transform: "scale(1.07)"}
});


const DisplayDiv = (props) => {
  return (
      <div id="display" ref={props.hostRef}>
        {props.msg}
      </div>
  );
};

const PosedDisplay = posed(DisplayDiv)({
  normal: {transform: "scale(1)",
           background: "#FFC107",
           border: "1px solid #FFB300",
           boxShadow: "0px 0px 1px 0.2px #FF6F00"},
  playing: {transform: "scale(1.1)",
            background: "#FFD54F",
            border: "1px solid #FFC107",
          boxShadow: "0px 0px 1px 1px #FFB300"}
});

const Display = (props) => {
  const playing = (props.playing) ? "playing" : "normal";
  return(
    <PosedDisplay pose={playing} msg={props.msg} />
  );
}


class Pad extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){
    this.audio = this.refs.audio;
    this.audio.onplay = () => this.props.play(this.props.id,true);
    this.audio.onended = () => this.props.play("",true);
  }

  handleClick(){
      this.audio.currentTime = 0;
      this.audio.play();
  }

  render(){
      const pose = ( this.props.current === this.props.id)?
          "playing": "normal";
      return(
      <Button pose={pose}>
        <button onClick={this.handleClick}
           id={this.props.id}
           className="drum-pad" >
          {this.props.id}
          <audio id={this.props.id}
               className="clip"
               src={this.props.src}
               ref="audio">
          </audio>
        </button>
              </Button>
    );
  }
};

class Pads extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.refs.pads.focus();
  }

  render(){
    const pressedKey = this.props.pressedKey;
      return(
        <div id="pads" ref="pads" tabIndex="0">
          {this.props.data.map((item) => {
            return (<Pad id={item.id}
                         src={item.src}
                         key={item.id}
                         play={this.props.play}
                         keyPressed={pressedKey === item.id}
                         current={this.props.current}/>);
          })}
        </div>
      );
  }
}

class DrumMachine extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div id="drum-machine">
        <Pads data={this.props.pads}
           pressedKey={this.props.pressedKey}
           play={this.props.play}
           current={this.props.current}/>
         <Display msg={this.props.msg}
                  playing={this.props.current !== ""}/>
      </div>
    );
  }
}

class App extends Component {
  constructor(props){
    super(props);

    this.play = this.play.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.state = {
      current: "",
      msg: "Start Music",
      pads :
        [{id: "Q",
          audio: new Audio("https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3"),
          src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
          label: "Heater-1", },
         {id: "W",
          audio: new Audio("https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3"),
          src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
          label: "Heater-2"},
         {id: "E",
          audio: new Audio("https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3"),
          src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
          label: "Heater-3"},
         {id: "A",
          audio: new Audio("https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3"),
          src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
          label: "Heater-4"},
         {id: "S",
          audio: new Audio("https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3"),
          src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
          label: "Clap"},
         {id: "D",
          audio: new Audio("https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3"),
          src: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
          label: "Open-HH"},
         {id: "Z",
          audio: new Audio("https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3"),
          src: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
          label: "Kick-n'-Hat"},
         {id: "X",
          audio: new Audio("https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3"),
          src: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
          label: "Kick"},
         {id: "C",
          audio: new Audio("https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3"),
          src: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3",
          label: "Closed-HH"}]
    };
  }

  keyPressed(e){
    const cc = e.charCode;
    const id = String.fromCharCode(cc).toUpperCase();
    this.play(id);
  }

  play(id, played = false){
    const target = this.state.pads.filter(
              (item) => item.id === id)[0];
    if (target){
      this.setState({current: id, msg: target.label});
      if (!played){
        target.audio.onended = () => this.setState({current: ""});
        target.audio.currentTime = 0;
        target.audio.play();
      }
    }else {
      this.setState({current: ""})
    }
  }

  render() {
    return (
      <div id="app" onKeyPress={this.keyPressed}>
        <header>Drum Machine</header>
        <DrumMachine current={this.state.current}
           msg={this.state.msg}
           play={this.play}
           pads={this.state.pads}
            />
      </div>
    );
  }
}

export default App;
