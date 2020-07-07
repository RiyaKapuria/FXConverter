import React from 'react'
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
function Input(props) {
    const useStyles = makeStyles({
        textBox : {
            display : "flex",
            flex : 1
        }
    })

    const classes = useStyles();

    return (
        <TextField  className = {classes.textBox} {...props}/>
    )
}

export default Input
