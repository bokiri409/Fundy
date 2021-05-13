import React, { Component } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import "./FundingBoard.css";
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Editor, Viewer } from '@toast-ui/react-editor';


const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  })
);

const FundingInfo = (props:any) => {



    return (

      <div className="container">
{props.detail}
        <div id="viewer">
        <Viewer
            initialValue={props.detail}
      >
      </Viewer>
      <Editor

initialValue={props.detail}
      >

      </Editor>
       
      </div>
  
        
      </div>
    );
  
}

export default FundingInfo;
