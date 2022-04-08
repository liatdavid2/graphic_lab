
import React,{Component} from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import logo from './logo.svg';
import ClassesList from './ClassesList';
import ImagesInFolderEditor from './ImagesInFolderEditor';

import './App.css';
import axios from 'axios';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
class App extends Component {
  
  state = {

    // Initially, no file is selected
    selectedFile: null
  };
  
  // On file select (from the pop up)
  onFileChange = event => {
  
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
  
  };
  
  // On file upload (click the upload button)
  onFileUpload = () => {
  
    // Create an object of formData
    const formData = new FormData();
  
    // Update the formData object
    formData.append(
      "video_file",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
  
    // Details of the uploaded file
    console.log(this.state.selectedFile);
  
    // Request made to the backend api
    // Send formData object
    axios.post("http://127.0.0.1:5000/upload_video", formData);
  };
  
  // File content to be displayed after
  // file upload is complete
  fileData = () => {
  
    if (this.state.selectedFile) {
       
      return (
        <div>
          <h2>File Details:</h2>
           
<p>File Name: {this.state.selectedFile.name}</p>           
<p>File Type: {this.state.selectedFile.type}</p>          
<p>
            Last Modified:{" "}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>

        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  };
  
  render() {
  
    return (
      <div>
         <Grid container style={{marginRight: "10px",marginLeft: "10px"}}
         spacing={0} >
           <Grid item xs={12}><h2> Video to Classified data! </h2> </Grid>
          
          </Grid>
          
          <Card style={{marginRight: "10px",marginLeft: "10px"}} >
          <CardContent>
          <Grid container spacing={0}>
          <Grid item xs={12}><h5>  File Upload using React! </h5> </Grid>
            <Grid item xs={12} md={4}>
               <input type="file" onChange={this.onFileChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ClassesList/>
            </Grid>
            <Grid item xs={12} md={2}>            
                <button onClick={this.onFileUpload}>
                Upload!
              </button>             
            </Grid>
          </Grid>
          </CardContent></Card>
          <div>
             
          <Card style={{marginRight: "10px",marginLeft: "10px",marginTop: "10px",padding:'0px'}} >
          <CardContent>
          <Grid container spacing={0}>
          <ImagesInFolderEditor/>
          </Grid>
          </CardContent>
          </Card>

             
             
          </div>
        {this.fileData()}
      </div>
    );
  }
}

export default App;
