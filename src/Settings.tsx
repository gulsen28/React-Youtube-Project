import axios from "axios";

const KEY='AIzaSyDlY4ihxkvMGTD_XB7siM1rKHPgmuL5GOk';

const service=axios.create({
    baseURL:'https://youtube.googleapis.com/youtube/v3/',
    timeout:0
})
export function getVideos(value:string){
    const prm={
        key:KEY,
        part:"snippet",
        q:value,
        type:"video"
        
    }
    return service.get("search",{params:prm})
}
export function getPopular() {
    const params = {
      key: KEY,
      part: "snippet",
      chart: "mostPopular",
      regionCode: "TR",
      maxResults: 6
    };
    return service.get("videos", { params: params });
  }