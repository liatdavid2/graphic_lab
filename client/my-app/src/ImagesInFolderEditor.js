import React from 'react';
import {Component} from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


export default class ImagesInFolderEditor extends Component {
    constructor() {
        super();
        this.state = {
            imagesFromFolder: [],
          };
    }
    
 
    componentWillMount(){
      // images =getAssets().list("images");
      //listImages = new ArrayList<String>(Arrays.asList(images));
     axios.get('http://localhost:5000/get_images_list_from_folder').then(resp => {

     //imagesFromFolder = [...useState(resp.data.images_from_folder)]
     this.setState({imagesFromFolder:[...resp.data.images_from_folder]})
     console.log(this.state.imagesFromFolder)
        
    });
    }
    handleChange(e) {
      console.log(e.target.name)
      // let isChecked = e.target.checked;
      // do whatever you want with isChecked value
    }
  render() {
    console.log(this.state.imagesFromFolder);
  return (
      
    this.state.imagesFromFolder && this.state.imagesFromFolder.length > 0 ?
      <Box sx={{ width: '100%', overflowY: 'regular' }} style={{paddingTop: "0px"}}>
        
        <ImageList sx={{  height: 350 }} cols={8} rowHeight={80}
        gap={0}
        style={{width: "100%",marginTop: "10px"}}>
        {this.state.imagesFromFolder.map((item, index) => (
            <ImageListItem key={index}>
            <img
                src={`../../assets/yes/${item}?w=50&h=50&fit=crop&auto=format`}
                srcSet={`../../assets/yes/${item}?w=50&h=50&fit=crop&auto=format&dpr=2 2x`}
                alt={777}
                loading="lazy"
            />
            <ImageListItemBar
              sx={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                  'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
              }}
          
              position="top"
              actionIcon={
                <IconButton>
                <Checkbox  key={index} name={item}  onChange={e => this.handleChange(e)}/>
                </IconButton>
              }
              actionPosition="left"
            />
            </ImageListItem>
            
        ))}
        </ImageList>
    </Box>:null
  );
 }
}

