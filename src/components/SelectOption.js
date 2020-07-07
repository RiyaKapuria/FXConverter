import React, { useState } from "react";
import { Select, FormControl, InputLabel, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
function SelectOption(props) {

  const [value, setValue] = useState();

  function handleChange(e) {
    setValue(e.target.value);
    props.onChange(e.target.value);
  }

  const useStyles = makeStyles({
    box: {
      display: "flex",
      flex: 1,
    },
  });

  const classes = useStyles();

  function renderMenuItems(){
      return props.items.map((option) => {
        return <MenuItem key = {option} value={option}>{option}</MenuItem>
      })
  }

  return (
    <FormControl variant="outlined" className={classes.box}>
      <InputLabel>{props.label}</InputLabel>
      <Select value={value} onChange={handleChange} label={props.label}>
        {renderMenuItems()}
      </Select>
    </FormControl>
  );
}

SelectOption.defaultProps = {
    onChange : value => {console.log(value)},
    items : []
}

export default SelectOption;
