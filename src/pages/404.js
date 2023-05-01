import Link from 'next/link'
import { Badge, Button, Container, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserButton, useAuth } from "@clerk/clerk-react";
import { useRouter } from 'next/router'


export default function _404() {
  const {isLoaded, userId, getToken, isSignedIn} = useAuth();
  const router = useRouter();

  if (!isLoaded) return <>Loading...</>;
  else if (isLoaded && !isSignedIn) router.push("/");
  else {
    return (
        <Container>
        <div
          className="container-fluid d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <Card className="p-5 rounded-5">
            <Card.Img
              variant="top"
              src="/duckget-logo.png"
              className="mx-auto"
              style={{ width: "300px" }}
            />
            <div className="text-center">
          <h1 className="display-3 font-weight-bold">Site not found</h1>
          <Button type='button' className="primary" href="/home">Back to the home page?</Button>
          </div>
          </Card>
        </div>
        </Container>
      );
    }
  }

