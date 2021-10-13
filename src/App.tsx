import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Container, Form, Grid, GridColumn, Header, Icon, Image, Segment } from "semantic-ui-react";
import { IPopular } from "./model/IPopular";
import { IVideosDetail } from "./model/IVideosDetail";
import { Item } from "./model/Shortvideoinfo";
import { getPopular, getVideos } from "./Settings";

function App() {
  //states
  const [videosInfo, setvideosInfo] = useState<IVideosDetail>()
  const [lastWatchVideos, setlastWatchVideos] = useState<Item[]>([])
  const [statusAdd, setstatusAdd] = useState(false)
  const [statusRemove, setstatusRemove] = useState(false)
  const [maFavoriteVideos, setmaFavoriteVideos] = useState<Item[]>([])
  const [searchvalue, setsearchvalue] = useState("")
  const [trendVideos, settrendVideos] = useState<IPopular>()


  function searchingVideos(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    getVideos(searchvalue).then(res => {
      setvideosInfo(res.data);
    }).catch(err => {
      console.error(err)
    }).finally(() => {
      console.log('Aranıyor :>> ');
    })


  }

  function fncClick(video: any) {
    //tıklanılan video
    localStorage.setItem("clickVideo", JSON.stringify(video));
    const watched = localStorage.getItem("watched");
    if (watched === null) {
      const arrWatch: Item[] = [];
      arrWatch.push(video);
      localStorage.setItem("watched", JSON.stringify(arrWatch));
    } else {
      const arrWatch: Item[] = JSON.parse(watched);
      let exist:number=0;
      for (const item of arrWatch) {
        if (video.id?.videoId === item.id?.videoId) {
          exist = 1;
        }
      }
      if(exist===0){
        arrWatch.push(video);
      if (arrWatch.length > 6) {
        arrWatch.shift();
      }
      localStorage.setItem("watched", JSON.stringify(arrWatch));
      }

      
    }

  }
  function watchingVideos() {
    const watchVideo = localStorage.getItem("watched");
    if (watchVideo == null) {
      console.log(' Son izlenen Video bulunmamaktadır:>> ');
    }
    else {
      const watchVideoArr: Item[] = JSON.parse(watchVideo)
      setlastWatchVideos(watchVideoArr);
    }

  }
  function myfavoriteVideos() {
    const favoriVideos = localStorage.getItem("favoriteVideo")
    if (favoriteVideos == null) {
      console.log('Favori videolar bulunmamaktadır :>> ');
    }
    else {
      const favoriteArr = favoriVideos;
      setmaFavoriteVideos(JSON.parse(favoriteArr!))
    }
  }


  function favoriteVideos(value: any) {

    const favorite = localStorage.getItem("favoriteVideo")
    if (favorite == null) {
      const arrFavori: Item[] = [];
      arrFavori.unshift(value);
      localStorage.setItem("favoriteVideo", JSON.stringify(arrFavori));

    } else {
      const old_watch: Item[] = JSON.parse(favorite);
      console.log('old_watch :>> ', old_watch);
      let exist: number = 0;
      for (const item of old_watch) {
        if (value.id?.videoId === item.id?.videoId) {
          exist = 1;
        }
      }
      if (exist === 0) {
        if (old_watch.length > 12) {
          old_watch.pop();
          localStorage.setItem("favoriteVideo", JSON.stringify(old_watch));
        } else {
          old_watch.unshift(value);
          localStorage.setItem("favoriteVideo", JSON.stringify(old_watch));
        }
      }
    }


  }
  function removeFavorite(value: number) {
    const favoriVid = localStorage.getItem("favoriteVideo")
    const favoriVideoArr: Item[] = JSON.parse(favoriVid!)
    favoriVideoArr.splice(value, 1)
    setmaFavoriteVideos(favoriVideoArr)
    localStorage.setItem("favoriteVideo", JSON.stringify(favoriVideoArr))
  }
  function fncRemove(value: number) {
    console.log('tıklandı :>> ', value);
    const watchVideo = localStorage.getItem("watched");
    const watchedVideoArr: Item[] = JSON.parse(watchVideo!)
    console.log('watchVideoArr :>> ', watchedVideoArr);
    watchedVideoArr.splice(value, 1);
    console.log('watchedVideoArr :>> ', watchedVideoArr);
    setlastWatchVideos(watchedVideoArr);
    localStorage.setItem("watched", JSON.stringify(watchedVideoArr))
  }

  useEffect(() => {
    watchingVideos();
    myfavoriteVideos();
    pop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  async function pop(){
    await getPopular().then(res=>{
      console.log('res.data :>> ', res.data);
      settrendVideos(res.data)
    }).catch(err => {
      console.error(err)
    }).finally(() => {
      console.log('Aranıyor :>> ');
    })
  }

  //console.log('videosInfo :>> ', videosInfo);

  return (
    <>
      <Container>
        <Form onSubmit={(e) => searchingVideos(e)} style={{ margin: 30, textAlign: "center" }}>
          <Form.Input
            widths={3}
            onChange={(e) => setsearchvalue(e.target.value)}
            action={{ type: "submit", icon: "searchengin", color: "blue", width: 35 }}

            placeholder='Search video' />
        </Form>
        <Grid doubling stackable container columns={3} style={{ margin: 30, textAlign: "center" }}>
          {
            videosInfo?.items.map((item, index) => {
              return (<GridColumn key={index} style={{ textAlign: "center", marginTop: 10, marginBottom: 10 }}>
                <Card

                  centered
                  as={Link}
                  to={"/videodetails/" + item.id?.videoId}
                  onClick={() => fncClick(item)}
                >
                  <Image

                    src={item.snippet?.thumbnails?.high?.url}
                    width={item.snippet?.thumbnails?.high?.width}
                    wrapped
                    ui={false}
                  />
                  <Card.Content>
                    <Card.Header
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "1",
                        WebkitBoxOrient: "vertical"
                      }}
                    >
                      {item.snippet?.title}
                    </Card.Header>
                    <Card.Meta>

                    </Card.Meta>
                    <Card.Description>
                      {item.snippet?.channelTitle}
                    </Card.Description>
                  </Card.Content>
                </Card>
                <Button as='div' labelPosition='right'>
                  <Button disabled={statusAdd} color='red' onClick={(e) => { favoriteVideos(item) }}>
                    <Icon name='heart' />
                    Like
                  </Button>
                  <Button disabled={statusRemove} onClick={(e) => { removeFavorite(index) }}>
                    <Icon name='heart' color="grey" />
                    Remove
                  </Button>
                </Button>
              </GridColumn>
              );
            })
          }
        </Grid>
        {lastWatchVideos.length > 0 &&
          <Segment style={{ margin: 30, borderColor: "none", backgroundColor: "silver", opacity: 0.9 }}>
            <Grid doubling stackable container columns={1}>
              <GridColumn>
                <Grid columns={2}>
                  <GridColumn style={{ textAlign: "right" }}>
                    <Icon.Group size='huge'>
                      <Icon loading size='big' name='circle notch' color='red' />
                      <Icon name='youtube' color='red' />
                    </Icon.Group>
                  </GridColumn>
                  <GridColumn style={{ marginTop: "auto" }}>
                    <Header as='h2'>
                      - Last Watched Videos -
                      <Header.Subheader style={{ color: "red", opacity: 0.5, fontStyle: "italic" }}>
                        You can add the videos favorite category
                      </Header.Subheader>
                    </Header>

                  </GridColumn>

                </Grid>
              </GridColumn>
            </Grid>

          </Segment>
        }

        <Grid doubling stackable container columns={3} style={{ margin: 30, textAlign: "center" }}>
          {
            lastWatchVideos?.map((item, index) => {
              return (<GridColumn key={index} style={{ textAlign: "center", marginTop: 10, marginBottom: 10 }}>
                <Button
                  onClick={(e) => fncRemove(index)}
                  animated='vertical'
                  style={{ textAlign: "center", marginBottom: 10 }}>
                  <Button.Content hidden><Icon name="window close outline" /></Button.Content>
                  <Button.Content visible>
                    <Icon name='close' />
                  </Button.Content>
                </Button>
                <Card
                  centered
                  as={Link}
                  to={"/videodetails/" + item.id?.videoId}
                  onClick={(e)=>fncClick(item)}
                >
                  <Image
                    src={item?.snippet?.thumbnails?.high?.url}
                    width={item?.snippet?.thumbnails?.high?.width}
                    wrapped
                    ui={false}
                  />
                  <Card.Content>
                    <Card.Header
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "red",
                        display: "-webkit-box",
                        WebkitLineClamp: "1",
                        WebkitBoxOrient: "vertical"
                      }}
                    >
                      {item?.snippet?.title}
                    </Card.Header>
                    <Card.Meta>

                    </Card.Meta>
                    <Card.Description>
                      {item?.snippet?.channelTitle}
                    </Card.Description>
                  </Card.Content>
                </Card>
              </GridColumn>

              );

            })
          }
        </Grid>
        {
          maFavoriteVideos != null &&
          <Segment style={{ margin: 30, borderColor: "none", backgroundColor: "silver", opacity: 0.9 }}>
            <Grid doubling stackable container columns={1}>
              <GridColumn>
                <Grid columns={2}>
                  <GridColumn style={{ textAlign: "right" }}>
                    <Icon.Group size='huge'>
                      <Icon loading size='big' name='circle notch' color='red' />
                      <Icon name='youtube' color='red' />
                    </Icon.Group>
                  </GridColumn>
                  <GridColumn style={{ marginTop: "auto" }}>
                    <Header as='h2'>
                      - Your Favorite Videos -
                      <Header.Subheader style={{ color: "red", opacity: 0.5, fontStyle: "italic" }}>
                        If you are watched,you see the videos "Last Video"
                      </Header.Subheader>
                    </Header>

                  </GridColumn>

                </Grid>
              </GridColumn>
            </Grid>

          </Segment>
        }
       <Grid doubling stackable container columns={3} style={{ margin: 30, textAlign: "center" }}>
          {
            maFavoriteVideos?.map((item, index) => {
              return (<GridColumn key={index} style={{ textAlign: "center", marginTop: 10, marginBottom: 10 }}>
                <Card
                  centered
                  as={Link}
                  to={"/videodetails/" + item.id?.videoId}
                  onClick={(e)=>fncClick(item)}
                >
                  <Image
                    src={item?.snippet?.thumbnails?.high?.url}
                    width={item?.snippet?.thumbnails?.high?.width}
                    wrapped
                    ui={false}
                  />
                  <Card.Content>
                    
                    <Card.Meta>
                    <Card.Header
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "red",
                        display: "-webkit-box",
                        WebkitLineClamp: "1",
                        WebkitBoxOrient: "vertical"
                      }}
                    >
                      {item?.snippet?.title}
                    </Card.Header>
                    </Card.Meta>
                    <Card.Description>
                      {item?.snippet?.channelTitle}
                    </Card.Description>
                  </Card.Content>
                </Card>
                <Button as='div' labelPosition='right'>
                  <Button disabled={true} color='red' onClick={(e) => { favoriteVideos(item);}}>
                    <Icon name='heart' />
                    Like
                  </Button>
                  <Button disabled={statusRemove} onClick={(e) => { removeFavorite(index); }}>
                    <Icon name='heart' color="grey" />
                    Remove
                  </Button>
                </Button>
              </GridColumn>

              );

            })
          }
        </Grid>
        {
         trendVideos != null &&
          <Segment style={{ margin: 30, borderColor: "none", backgroundColor: "silver", opacity: 0.9 }}>
            <Grid doubling stackable container columns={1}>
              <GridColumn>
                <Grid columns={2}>
                  <GridColumn style={{ textAlign: "right" }}>
                    <Icon.Group size='huge'>
                      <Icon loading size='big' name='circle notch' color='red' />
                      <Icon name='youtube' color='red' />
                    </Icon.Group>
                  </GridColumn>
                  <GridColumn style={{ marginTop: "auto" }}>
                    <Header as='h2'>
                      - Trend Videos -
                      <Header.Subheader style={{ color: "red", opacity: 0.5, fontStyle: "italic" }}>
                        If you are watched,you see the videos "Last Video"
                      </Header.Subheader>
                    </Header>

                  </GridColumn>

                </Grid>
              </GridColumn>
            </Grid>

          </Segment>
        }
        <Grid doubling stackable container columns={3} style={{ margin: 30, textAlign: "center" }}>
          {
            trendVideos?.items.map((item, index) => {
              return (<GridColumn  key={index} style={{ textAlign: "center", marginTop: 10, marginBottom: 10 }}>
                <Card
                  centered
                  
                >
                  <Image
                    src={item.snippet?.thumbnails?.high?.url}
                    width={item.snippet?.thumbnails?.high?.width}
                    wrapped
                    ui={false}
                  />
                  <Card.Content>
                    <Card.Header
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "red",
                        display: "-webkit-box",
                        WebkitLineClamp: "1",
                        WebkitBoxOrient: "vertical"
                      }}
                    >
                      {item.snippet.title}
                    </Card.Header>
                    <Card.Meta>

                    </Card.Meta>
                    <Card.Description>
                      {item.snippet.channelTitle}
                    </Card.Description>
                  </Card.Content>
                </Card>
                
              </GridColumn>

              );

            })
          }
        </Grid>



      </Container>
    </>

  );
}

export default App;
