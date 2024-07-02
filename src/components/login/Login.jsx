import "./Login.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Login() {
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate("/home");
    }
  }, [navigate]);

  const loginData = () => {
    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: phone,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem(
          "access_token",
          data.data.tokens.accessToken.token
        );
        toast.success("You are successfully logged in!");
        navigate("/home");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <section
      id="form"
      className="vh-100 d-flex align-items-center justify-content-center"
    >
      <Form>
        <Form.Group className="mb-3" controlId="loginTel">
          <Form.Label>Telephone number:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Admin's number"
            onChange={(e) => setPhone(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="loginPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Admin's password"
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="button" onClick={loginData}>
          Submit
        </Button>
      </Form>
    </section>
  );
}

export default Login;
