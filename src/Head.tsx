import React from 'react'
import{Container, Grid, GridColumn, Icon} from 'semantic-ui-react';
import { Link } from "react-router-dom";
export default function Head() {
    return (
        <div>
            <Container>
                <Grid doubling stackable container columns={3} style={{border:"1px solid grey",opacity:0.8,borderRadius:20,margin:20}}>
                    <GridColumn width="2">
                    <Link to="/"><Icon size='massive' name="youtube" style={{margin:"0.5em",color:"black"}}/></Link>
                    </GridColumn>
                    
                    <GridColumn width="13">
                    <h1 style={{textAlign:"left",fontStyle:"oblique",fontSize:"5em", margin:"1em"}}>YOUTUBE</h1>
                    </GridColumn>
                </Grid>
           
            </Container>
        </div>
    )
}
