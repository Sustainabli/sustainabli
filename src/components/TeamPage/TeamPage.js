import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import Header from '../Header/Header.js';

import kevin_tu_pfp from "./../../assets/kevin_tu_pfp.png"
import michael_li_pfp from "./../../assets/michael_li_pfp.png"
import oliver_desposito_pfp from "./../../assets/oliver_desposito_pfp.png"
import andrew_hong_pfp from "./../../assets/andrew_hong_pfp.png"
import telon_yan_pfp from "./../../assets/telon_yan_pfp.png"


import './TeamPage.scss';

function TeamPage() {

  var about_us_input = [
    {
      "name": "Kevin Tu",
      "position": "Sustanibli Team Member",
      "bio": "Kevin is a senior studying biology and economics. He is the Green Labs coordinator at the University of Maryland and is part of the International Institute for Sustainable Laboratories. Ask him how you can make your labs even more green! Email: ktu@umd.edu",
      "image": kevin_tu_pfp
    },
    {
      "name": "Michael Li",
      "title": "Sustanibli Team Member",
      "bio": "Michael graduated from UMD in Spring 2022 with a triple degree in Computer Science, Mathematics, and Cello Performance. I'm now working as a Software Engineer at Amazon. In my free time, I like to play music (cello) and table tennis.",
      "image": michael_li_pfp
    },
    {
      "name": "Andrew Hong",
      "title": "Sustanibli Team Member",
      "bio": "Andrew is a rising Senior at UMD pursuing a double degree in computer science and biology.",
      "image": andrew_hong_pfp,
    },
    {
      "name": "Telon Yan",
      "title": "Sustanibli Team Member",
      "bio": "Telon is a rising senior studying mechanical engineering and computer science. I lead the designing and building of physical things.",
      "image": telon_yan_pfp
    },
    {
      "name": "Oliver D'Esposito",
      "title": "Sustanibli Team Member",
      "bio": "Oliver is a freshman at the University of Maryland studying computer science.",
      "image": oliver_desposito_pfp
    },
  ];

  return (
    <Container fluid className="TeamPage">
      <Header
        pageName='Our Team'
      />
      <div className="team_card_holder" pl="25px" pr="25px">
        <Row xs={1} md={3} className="g-4">
          {about_us_input.map((person) => (
            <Col key={person.name}>
              <Card key={person.name} border-color="red">
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
    </Container>
  )
}

export default TeamPage;
