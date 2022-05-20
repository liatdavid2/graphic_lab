import * as React from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export default function ClassesList(props) {
  return (
    <Stack spacing={2} >
      <Autocomplete style={{padding:"5px",paddingBottom: "10px", padding: 0,
    margin: 0}}
        multiple  sx={{ marginLeft:"20px" }}
        onChange={(event, value) => {console.log(value);
        
          props.parentChangeSelectedClasses(value);}} // prints the selected value
        id="tags-standard"
        options={props.classes_names}
        getOptionLabel={(option) => option}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="Select classes"
          />
        )}
      />
    </Stack>
  );
}
