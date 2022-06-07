import React from 'react';
import { withRouter } from "react-router-dom";
import { Card, Container, Row, Col, CardDeck, CardGroup, Jumbotron } from 'react-bootstrap';
import Image from "react-bootstrap/Image";


import waffle from "./../../assets/pikachu-modified.png"
import kevin_tu_pfp from "./../../assets/kevin_tu_pfp.png"
import michael_li_pfp from "./../../assets/michael_li_pfp.png"
import jason_lavis_pfp from "./../../assets/jason_lavis_pfp.png"
import andrew_hong_pfp from "./../../assets/andrew_hong_pfp.png"
import telon_yan_pfp from "./../../assets/telon_yan_pfp.png"



import './AboutUs.css';

function AboutUs() {

    var teamInfo = [

    ]
    var about_us_input = [
      {
        "name": "Kevin Tu",
        "position": "Sustanibli Team Member",
        "bio": "Kevin has been working in research labs for 6 years, and he started Sustainabli after noticing the amount of waste scientists produce every day.",
        "image": kevin_tu_pfp
      },
      {
        "name": "Michael Li",
        "title": "Sustanibli Team Member",
        "bio": "Cellist by day and coder by night though you'll probably find me taking a nap somewhere. Recently graduated senior that majored in Computer Science, Math, and Cello Performance at UMD.",
        "image": michael_li_pfp
      },
      {
        "name": "Jason Lavis",
        "title": "Sustanibli Team Member",
        "bio": "When I am not fishing or sailing, I'm most likely playing video games. Currently a Senior studying Computer Science at UMD.\n",
        "image": jason_lavis_pfp
      },
      {
        "name": "Andrew Hong",
        "title": "Sustanibli Team Member",
        "bio": "Rising Senior at UMD pursuring a double degree in computer science and biology.",
        "image": andrew_hong_pfp,
      },
      {
        "name": "Telon Yan",
        "title": "Sustanibli Team Member",
        "bio": "Hi, I'm Telon Yan, and I'm a rising senior studying mechanical engineering and computer science. I lead the designing and building of physical things.",
        "image": telon_yan_pfp
      },
    ];
  
    return (
      <div className="aboutUs">
        <div className="header">
            <div class="container-fluid bg-light text-dark p-5">
                <div class="container bg-light p-5">
                    <h1 class="text-center">Our Team</h1>
                    <hr/>
                </div>
            </div>
          {/* <Jumbotron>
            <h1 className="text-center">Our Team</h1>
          </Jumbotron> */}
        </div>
        <div className="team_card_holder">
          <Row xs={1} md={3} className="g-4">
            {about_us_input.map((person, index) => (
              <Col>
                <Card key = {person.name} border-color="red">
                  <Card.Img variant="top" src={person.image} />
                  <Card.Body>
                    <Card.Title>{person.name}</Card.Title>
                    <Card.Text>
                      {person.bio}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    )
  }

  export default AboutUs;