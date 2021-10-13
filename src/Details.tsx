import  { useEffect, useState } from 'react'
import { Button, Container, Embed, Grid, GridColumn, Icon, Segment } from 'semantic-ui-react';
import { Item } from './model/Shortvideoinfo';

export default function Details() {

    const [videoInfo, setVideoInfo] = useState<Item>()
    const [statusAdd, setstatusAdd] = useState(false)
    const [statusRemove, setstatusRemove] = useState(false)
  
    
    useEffect(() => {
        const clickVideo = JSON.parse(localStorage.getItem("clickVideo")!);
        console.log('clickVideo :>> ', clickVideo);
        
            setVideoInfo(clickVideo);
        
        

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusAdd,statusRemove])
    
    function addFavoriteVideos() {
        const favorite = localStorage.getItem("favoriteVideo")
        if (favorite == null) {
          const arrFavori: Item[] = [];
          arrFavori.unshift(videoInfo!);
          
          localStorage.setItem("favoriteVideo", JSON.stringify(arrFavori));
            setstatusAdd(true)
              setstatusRemove(false)
        } else {
          const old_watch: Item[] = JSON.parse(favorite);
          console.log('old_watch :>> ', old_watch);
          let exist: number = 0;
          for (const item of old_watch) {
            if (videoInfo?.id?.videoId === item.id?.videoId) {
              exist = 1;
            }
          }
          if (exist === 0) {
              setstatusAdd(false)
              setstatusRemove(true)
            if (old_watch.length > 12) {
              old_watch.pop();
              localStorage.setItem("favoriteVideo", JSON.stringify(old_watch));
            } else {
              old_watch.unshift(videoInfo!);
              localStorage.setItem("favoriteVideo", JSON.stringify(old_watch));
            }
          }
          else{
              setstatusRemove(false)
              setstatusAdd(true)
          }
        }
    

    }
    function removeFavoriteVideos() {
        const favoriVideo=localStorage.getItem("favoriteVideo");
        const arrVideo:Item[]=JSON.parse(favoriVideo!)
        const videoIndex=arrVideo.indexOf(videoInfo!);
        arrVideo.splice(videoIndex,1);
        localStorage.setItem("favoriteVideo",JSON.stringify(arrVideo))
        setstatusRemove(true)
        setstatusAdd(false)
    }

    return (

        <>
            <Container>
                <Grid columns={1} style={{ marginTop: 30 }}>


                    {
                        <GridColumn>
                            <Embed
                                autoplay={true}
                                hd={false}
                                id={videoInfo?.id?.videoId}
                                source="youtube"
                                iframe={{
                                    allowFullScreen: true,
                                    style: { padding: 10 }
                                }}
                                placeholder={videoInfo?.snippet?.thumbnails?.default?.url}
                            />
                        </GridColumn>
                    }

                </Grid>
                <Segment>
                    {
                        <Grid columns={2}>
                            <GridColumn width={12} style={{ backgroundColor: "#e3f2fd" }} >

                                <h2>{videoInfo?.snippet?.title}</h2>
                                <p style={{ marginTop: 30, marginLeft: 10 }}><Icon name="users" size="big" color="purple" /> {videoInfo?.snippet?.channelTitle}</p>
                                
                                <p style={{ fontStyle: 'italic', fontSize: 15, margin: 10 }}>{videoInfo?.snippet?.description}</p>
                            </GridColumn>

                            <GridColumn width={4} style={{ display: "flex", justifyContent: "center", backgroundColor: "#e3f2fd", alignItems: "center" }} >
                                <Button as='div' labelPosition='right'>
                                    <Button disabled={statusAdd} color='red' onClick={(e) => { addFavoriteVideos() }}>
                                        <Icon name='heart' />
                                        Like
                                    </Button>
                                    <Button disabled={statusRemove} onClick={(e) => { removeFavoriteVideos() }}>
                                        <Icon name='heart' color="grey" />
                                        Remove
                                    </Button>
                                </Button>
                            </GridColumn>
                        </Grid>}
                </Segment>
            </Container>
        </>

    )
}


