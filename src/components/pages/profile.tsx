import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Avatar,
  Box,
} from '@mui/material';
import { Select, MenuItem } from '@mui/material';
import MenuAppBar from '../common/navbar';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    avatar: '/path-to-avatar-image.jpg',
    phone:'93456668796',
    role:'Frontend Developer' // Replace with the actual path to your user's avatar image
  });

  const navigate = useNavigate();
  
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission, e.g., update user profile data on the server
    console.log('Updated user profile:', user);
  };
  

  return (
    <>
    <MenuAppBar />
    <Container maxWidth="sm">
      <Paper  sx={{ padding: 5, marginTop:12, border:'1px solid #556cd6', }}>
        <Avatar
          alt="User Avatar"
          src={user.avatar}
          sx={{ width: 90, height: 90, margin: '0 auto', marginTop:-11, background:'#556cd6' }}
        />
        <Typography variant="h5" gutterBottom sx={{textAlign:'center', marginBottom:4, mt:1, color:'#101828',}}>
          User Profile
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                value={user.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                value={user.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                name="Phone Number"
                fullWidth
                value={user.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              {/* <TextField
                label="Role"
                name="Role"
                fullWidth
                value={user.email}
                onChange={handleChange}
              /> */}
              <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={user.role}
          label="Role"
          onChange={handleChange}
          sx={{width:'100%'}}
        >
          <MenuItem value="Frontend Developer">Frontend Developer</MenuItem>
          <MenuItem value="Backend Develpoer">Backend Develpoer</MenuItem>
          <MenuItem value="Tester">Tester</MenuItem>
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="Manager">Manager</MenuItem>
        </Select>
            </Grid>
          </Grid>
          <Box sx={{display: 'flex'}}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 4, marginRight: 2 }}
          >
            Save
          </Button>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            sx={{ marginTop: 4 }}
            onClick={()=>{navigate("/")}}
          >
            Cancel
          </Button>
          </Box>
        </form>
      </Paper>
    </Container>
    </>
  );
};

export default Profile;
