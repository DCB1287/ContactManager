import React from 'react'
import { Button, Form, Icon, Message, Segment } from 'semantic-ui-react'
import axios from 'axios'
import cookie from "js-cookie"


const INITIAL_USER = {
  name: "",
  email: "",
  password: ""

}
//This will give the user a token we can track and navigate to the contacts page
function handleLogin(token) {
  cookie.set("token", token);
  //Router.push("/account");
}

function catchErrors(error, displayError) {
  let errorMsg;
  if (error.response) {
    // The request was made and the server responsed with a status code that is not in the range of 2XX
    errorMsg = error.response.data;
    console.error("Error response", errorMsg);

    // For Cloudinary image uploads
    if (error.response.data.error) {
      errorMsg = error.response.data.error.message;
    }
  } else if (error.request) {
    // The request was made, but no response was received
    errorMsg = error.request;
    console.error("Error request", errorMsg);
  } else {
    // Something else happened in making the request that triggered an error
    errorMsg = error.message;
    console.error("Error message", errorMsg);
  }

}


function Signup() {
  const [user, setUser] = React.useState(INITIAL_USER)
  const [disabled, setDisabled] = React.useState("true")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')


  React.useEffect(() => {
    const isUser = Object.values(user).every(el => Boolean(el)) 
    isUser ? setDisabled(false) : setDisabled(true)
  }, [user])

  function handleChange(event) {
    const { name, value } = event.target
    setUser(prevState => ({...prevState, [name]: value }) ) 
  }

  async function handleSubmit(event) {
    event.preventDefault()

    //make request to sign up user
    try {
      setLoading(true)
      setError('')
      const url = "http://localhost:3000/api/signup"               //This URL will need to be changed         
      const payload = { ...user} 
      console.log(user)
      const response = await axios.post(url, payload)          //Call the API to post the user data from the form.
      handleLogin(response.data)
    } catch (error) {
      catchErrors(error)
    } finally {
      setLoading(false)
    }

  }


  return (
    <>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css"/>
    <Message 
      attached
      icon="settings"
      header="Get Started!"
      content="Create a new account"
      color="teal"
    />
    <Form error={Boolean(error)} loading={loading} onSubmit={handleSubmit}> 
      <Message 
        error
        header="Error!"
        content={error}
      />
      <Segment>
        <Form.Input 
          fluid
          icon="user"
          iconPosition="left"
          label="Name"
          placeholder="Name"
          name="name"
          value={user.name}
          onChange={handleChange}
        />
        <Form.Input 
          fluid
          icon="envelope"
          iconPosition="left"
          label="Email"
          type="email"
          placeholder="Email"
          name="email"
          value={user.email}
          onChange={handleChange}
        />
        <Form.Input 
          fluid
          icon="lock"
          iconPosition="left"
          placeholder="Password"
          label="Password"
          name="password"
          type="password"
          value={user.password}
          onChange={handleChange}
        />
        <Button
          icon="signup"
          type="submit"
          color="orange"
          content="Signup"
        />
      </Segment>
    </Form>
    <Message attached="bottom" warning>
      <Icon name="help" />
      Already a user?{" "}
      <a href="/login">Log in here</a>
    </Message>
    </>
    )
}

export default Signup;
