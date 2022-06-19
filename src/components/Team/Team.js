import React from 'react';
import { Card, Row, Col} from 'react-bootstrap';


import kevin_tu_pfp from "./../../assets/kevin_tu_pfp.png"
import michael_li_pfp from "./../../assets/michael_li_pfp.png"
import jason_lavis_pfp from "./../../assets/jason_lavis_pfp.png"
import andrew_hong_pfp from "./../../assets/andrew_hong_pfp.png"
import telon_yan_pfp from "./../../assets/telon_yan_pfp.png"
import alisha_pun_pfp from "./../../assets/alisha_pun_pfp.png"


import './Team.css';

function AboutUs() {

    var teamInfo = [

    ]
    var about_us_input = [
      {
        "name": "Kevin Tu",
        "position": "Sustanibli Team Member",
        "bio": "I have been working in research labs for 6 years, and started Sustainabli after noticing the amount of waste scientists produce every day.",
        "image": kevin_tu_pfp
      },
      {
        "name": "Michael Li",
        "title": "Sustanibli Team Member",
        "bio": "I graduated from UMD in Spring 2022 and am now working as a Software Engineer at Amazon. In my free time, I like to play music (cello) and play table tennis.",
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
        "bio": "I'm a rising Senior at UMD pursuring a double degree in computer science and biology.",
        "image": andrew_hong_pfp,
      },
      {
        "name": "Telon Yan",
        "title": "Sustanibli Team Member",
        "bio": "I'm a rising senior studying mechanical engineering and computer science. I lead the designing and building of physical things.",
        "image": telon_yan_pfp
      },
      {
        "name": "Alisha Pun",
        "title": "Sustanibli Team Member",
        "bio": "I am a rising junior at UMD, working towards a B.S. in Economics. I am also studying statistics and Spanish as my minors.",
        "image": alisha_pun_pfp
      },
    ];
  
    return (
      <div className="aboutUs">
        <div className="header">
            <div class="container-fluid bg-light text-dark p-5">
                <div class="container bg-light p-5">
                    <h1 class="text-center" fontSize="3em">Our Team</h1>
                    <hr/>
                </div>
            </div>
        </div>
        <div className="team_card_holder" pl="25px" pr="25px">
          <Row xs={1} md={3} className="g-4">
            {about_us_input.map((person) => (
              <Col>
                <Card key = {person.name} border-color="red">
                  <Card.Img variant="top" src={person.image}/>
                  <Card.Body textAligh="left">
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