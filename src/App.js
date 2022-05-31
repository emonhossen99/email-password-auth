import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword,updateProfile, sendEmailVerification,sendPasswordResetEmail } from "firebase/auth";
import { Form, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import app from "./firebase.init";
import { useState } from "react";

const auth = getAuth(app)

function App() {
  const [validated, setValidated] = useState(false);
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [success, setSuccess] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleNameBlur = event => {
    setName(event.target.value);
  }

  const handleEmailBlur = event => {
    setEmail(event.target.value);
  }

  const handlePasswordlBlur = event => {
    setPassword(event.target.value);
  }

  const handleLogInRegister = event => {
    setRegister(event.target.checked)
  }

  const handleResetPassword  = () => {
    sendPasswordResetEmail(auth,email)
    .then(() => {
      setSuccess('send password reset your Email!!');
    })
    .catch(error => {
      setError(error.message)
    })
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName:name
    })
      .then(() => {
        setSuccess('Your profile updating');
      })
      .catch(error => {
        setError(error.message)
      })
  }

  const verificationEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        setSuccess('Your Email Verify');
      })
      .catch(error => {
        setError(error.message)
      })
  }

  const handleSubmited = event => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      setError('Places Put A Spacial Chareacter !!')
      return;
    }
    setValidated(true);
    setError('')

    if (register) {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
        })
        .catch(error => {
          setError(error.message);
        })

    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user
          setSuccess('Your User Create Now!!')
          console.log(user);
          setEmail('');
          setPassword('')
          verificationEmail();
          setUserName();

        })
        .catch((error) => {
          const errorMessage = error.message;
          setError(errorMessage)
        });
    }
    event.preventDefault();
  }


  return (
    <div>
      <div className="submited w-50 mx-auto mt-3">
        <h2 className="text-primary">Places {register ? "LogIn!!" : "Register!"}</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmited}>

         { !register && <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>Your Name </Form.Label>
            <Form.Control onBlur={handleNameBlur} type="text" placeholder="Enter Name" required />
            <Form.Control.Feedback type="invalid">
              Please provide Your Name.
            </Form.Control.Feedback>
          </Form.Group>}

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordlBlur} type="password" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleLogInRegister} type="checkbox" label="Already You Have An Account ??" />
          </Form.Group>
          <p className="text-success">{success}</p>
          <p className="text-danger">{error}</p>
          <Button onClick={handleResetPassword} variant="info">Forget Password ??</Button>{' '}
          <Button variant="primary" type="submit">
            {register ? "LogIn" : "Register"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
