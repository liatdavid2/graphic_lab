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
      <Box sx={{ width: 1000, height: 450, overflowY: 'regular' }}>
          <button>delete</button>
        <ImageList sx={{ width: 1000, height: 450 }} cols={8} rowHeight={164}>
        {this.state.imagesFromFolder.map((item, index) => (
            <ImageListItem key={index}>
            <img
                src={`../../assets/person/${item}?w=50&h=50&fit=crop&auto=format`}
                srcSet={`../../assets/person/${item}?w=50&h=50&fit=crop&auto=format&dpr=2 2x`}
                alt={777}
                loading="lazy"
            />
            <ImageListItemBar
              sx={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                  'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
              }}
              title={item}
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

const itemData = [
  {
    img: '../../assets/person/gaga725.jpg',
    title: 'gaga725',
    author: 'swabdesign',
  },
  {
    img: '../../assets/person/gaga7410.jpg',
    title: 'gaga7410',
    author: 'Pavel Nekoranec',
  },
  {
    img: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
    title: 'Sink',
    author: 'Charles Deluvio',
  },
  {
    img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
    title: 'Kitchen',
    author: 'Christian Mackie',
  },
  {
    img: 'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
    title: 'Blinds',
    author: 'Darren Richardson',
  },
  {
    img: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622',
    title: 'Chairs',
    author: 'Taylor Simpson',
  },
  {
    img: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
    title: 'Laptop',
    author: 'Ben Kolde',
  },
  {
    img: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
    title: 'Doors',
    author: 'Philipp Berndt',
  },
  {
    img: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
    title: 'Coffee',
    author: 'Jen P.',
  },
  {
    img: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
    title: 'Storage',
    author: 'Douglas Sheppard',
  },
  {
    img: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
    title: 'Candle',
    author: 'Fi Bell',
  },
  {
    img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
    title: 'Coffee table',
    author: 'Hutomo Abrianto',
  },
];