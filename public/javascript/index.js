const signup = (e) => {
  console.log('hello');
  const name = document.getElementById('name').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const cpassword = document.getElementById('cpassword').value;
  console.log(name, username, password, cpassword);
  if (name === '' || password === '' || username === '' || cpassword === '') {
    window.alert('please fill all entries');
    return false;
  }
  if (password !== cpassword) {
    window.alert('password and confirm password are not matching');
    return false;
  }
  return true;
};

const login = () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if (username === '' || password === '') {
    window.alert('please fill entries');
    return false;
  }
  return true;
};
