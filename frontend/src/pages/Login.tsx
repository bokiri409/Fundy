import { Box, Checkbox, Container, Grid, TextField } from '@material-ui/core';
import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Box display="flex" justifyContent="center">
      <Box mt={10} width={720}>
        <Grid container spacing={3}>
          <Grid item className="logo" xs={12}>
            fundy
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="아이디(이메일)" variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="비밀번호" variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <Checkbox></Checkbox>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Login;
