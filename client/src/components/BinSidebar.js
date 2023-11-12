import { useState } from 'react';
import { TextField, FormControlLabel, Checkbox } from '@mui/material';

export default function BinInfoSidebar() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [satelliteView, setSatelliteView] = useState(false);

  return (
    <div>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}  
      />

      <TextField
        label="Description" 
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}   
      />

      <FormControlLabel
        label="Satellite View"
        control={
          <Checkbox
            checked={satelliteView}
            onChange={(e) => setSatelliteView(e.target.checked)}  
          />
        }
      />
    </div>
  );

}