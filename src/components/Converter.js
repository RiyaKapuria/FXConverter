import React, { Component } from "react";
import { Container, Typography, Grid, Paper } from "@material-ui/core";
import "./style.css";
import Input from "./Input";
import SelectOption from "./SelectOption";
import Controller from "./ConverterController";

const side = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};

export default class Converter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      [side.LEFT]: {
        currency: null,
        amount: null,
      },
      [side.RIGHT]: {
        currency: null,
        amount: null,
      },
    };
  }

  /**
   * calculate on selecting currencies
   * @param {*} value 
   * @param {*} name 
   */
  handleSelect(value, name) {
    let data = this.state[name];
    data.currency = value;

    let fromTo = this.findFromTo(side.LEFT);

    this.setState({ [name]: data }, () => this.calculate(fromTo));
  }

  /**
   * calculate on changing amount
   * @param {*} e 
   * @param {*} name 
   */
  handleAmountChange(e, name) {
    let value = e.target.value;
    let data = this.state[name];
    data.amount = value ? parseFloat(value) : 0;

    if(!value){ // if any one of the amount is invalid or 0, -> reset
      data = this.state;
      data[side.LEFT].amount = 0;
      data[side.RIGHT].amount = 0;

      this.setState(data);
      return;
    }

    let fromTo = this.findFromTo(name);

    this.setState({ [name]: data }, () => this.calculate(fromTo));
  }

  /**
   * Based on the use editing side, 
   * deciding which one is 'from value' and 'to value'
   * @param {*} name 
   */
  findFromTo(name) {
    let from = null;
    let to = null;

    if (name === side.LEFT) {
      from = side.LEFT;
      to = side.RIGHT;
    } else {
      from = side.RIGHT;
      to = side.LEFT;
    }

    return { from, to };
  }

  //calculates result
  calculate(fromTo) {
    let data = this.state;

    let from = fromTo.from;
    let to = fromTo.to;
    let fromData = data[from];
    let toData = data[to];

    let result = Controller.calculate(fromData, toData);
    if(result){
      result = Controller.fixDecimal(toData.currency,result);
      data[to].amount = result;
      this.setState(data);
    }
  }

  renderCalculator() {
    return (
      <Grid container direction="row">
        {/* Padding side */}
        <Grid item sm={2} xs={0}></Grid>
        {/* Calculation area */}
        <Grid item container xs={12} sm={8}>
          <Paper elevation={3} className="converter-card">
            <Grid spacing={3} container direction="row">
              
              <Grid item xs={12} sm={6}>
                <SelectOption
                  items={Controller.getCurrencies()}
                  label={"From"}
                  onChange={(value) => this.handleSelect(value, side.LEFT)}
                />
                <br></br>
                <br></br>
                <Input
                  ref={side.LEFT}
                  onChange={(e) => this.handleAmountChange(e, side.LEFT)}
                  id={side.LEFT}
                  variant="outlined"
                  label="Amount"
                  value = {this.state.LEFT.amount}
                  disabled={(this.state.LEFT.currency === null || this.state.RIGHT.currency === null) ? true : false}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <SelectOption
                  items={Controller.getCurrencies()}
                  label={"To"}
                  onChange={(value) => this.handleSelect(value, side.RIGHT)}
                />
                <br></br>
                <br></br>
                <Input
                  value = {this.state.RIGHT.amount}
                  ref={side.RIGHT}
                  id={side.RIGHT}
                  variant="outlined"
                  label="Amount"
                  onChange={(e) => this.handleAmountChange(e, side.RIGHT)}
                  disabled={(this.state.LEFT.currency === null || this.state.RIGHT.currency === null) ? true : false}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }

  render() {
    return (
      <Container
        maxWidth="md"
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          <Typography style={{ color: "#6f6f6f" }} variant="h3" align="center">
            FX Converter
          </Typography>
          <center>
            <Typography style={{ color: "#6f6f6f" }} variant="span" align="center">
              Convert The Currency Here
            </Typography>
          </center>
        </div>
        <br></br>
        {this.renderCalculator()}
      </Container>
    );
  }
}
