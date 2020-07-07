import React, { Component } from "react";
import { Container, Typography, Grid, Paper } from "@material-ui/core";
import "./style.css";
import Input from "./Input";
import SelectOption from "./SelectOption";
import ConverterFunc from "./ConverterFunc";

const side = {
  FROM: "FROM",
  TO: "TO"
};

export default class CurrencyConverter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      [side.FROM]: {
        currency: null,
        amount: 0,
      },
      [side.TO]: {
        currency: null,
        amount: 0,
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

    let fromTo = this.findFromTo(side.FROM);

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
      data[side.FROM].amount = 0;
      data[side.TO].amount = 0;

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

    if (name === side.FROM) {
      from = side.FROM;
      to = side.TO;
    } else {
      from = side.TO;
      to = side.FROM;
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

    let result = ConverterFunc.calculate(fromData, toData);
    if(result){
      result = ConverterFunc.fixDecimal(toData.currency,result);
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
                  items={ConverterFunc.getCurrencies()}
                  label={"From"}
                  onChange={(value) => this.handleSelect(value, side.FROM)}
                />
                <br></br>
                <br></br>
                <Input
                  ref={side.FROM}
                  onChange={(e) => this.handleAmountChange(e, side.FROM)}
                  id={side.FROM}
                  variant="outlined"
                  label="Amount"
                  value = {this.state.FROM.amount}
                  disabled={(this.state.FROM.currency === null || this.state.TO.currency === null) ? true : false}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <SelectOption
                  items={ConverterFunc.getCurrencies()}
                  label={"To"}
                  onChange={(value) => this.handleSelect(value, side.TO)}
                />
                <br></br>
                <br></br>
                <Input
                  value = {this.state.TO.amount}
                  ref={side.TO}
                  id={side.TO}
                  variant="outlined"
                  label="Amount"
                  onChange={(e) => this.handleAmountChange(e, side.TO)}
                  disabled={(this.state.FROM.currency === null || this.state.TO.currency === null) ? true : false}
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
