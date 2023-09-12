import { error } from "console"
import { google } from "googleapis"
import * as path from 'path'


export const obtainVidData = async (req, res, next) => {

  try {


    const keyFilePath = path.resolve('tutoweb-392611-7a81f64d5b87.json')


    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ['https://www.googleapis.com/auth/youtube.readonly']
    })

    const youtube = google.youtube({
      version: 'v3',
      auth: auth
    })

    const { url } = req.body
    const videoDetails = await getVideoDetails(url, youtube)

    req.videoDetails = videoDetails

    next()
  } catch (error) {
    if(error.message.includes("Enlace no valido")){
      return res.status(401).json({
        
      })
    }

    return res.status(500).json({
      message: 'Error al obtener datos',
      error
    });
  }

}


// Función para obtener los detalles del video
async function getVideoDetails(url, youtube) {
  try {
    // Extrae el ID del video de la URL
    const videoId = extractVideoId(url);

    if(videoId === null){
      throw Error("Enlace no valido")
    }

    // Realiza la solicitud a la API de YouTube Data para obtener la información del video
    const response = await youtube.videos.list({
      part: 'snippet, statistics, contentDetails',
      id: videoId
    });


    // Extrae los datos del video de la respuesta
    const videoData = response.data.items[0];

    // Obtiene el título, autor y URL de la imagen del video
    const title = videoData.snippet.title;
    const author = videoData.snippet.channelTitle;
    const imageUrl = videoData.snippet.thumbnails.medium.url;
    const description = videoData.snippet.description;
    const publishedDate = videoData.snippet.publishedAt
    const ybLikes = videoData.statistics.likeCount
    const duration = parseVideoDuration(videoData.contentDetails.duration)

    // Devuelve los datos del video
    return {
      title: title,
      author: author,
      imageUrl: imageUrl,
      description: description,
      publishedDate: publishedDate,
      ybLikes: ybLikes,
      duration: duration
    };
  } catch (error) {
    console.error('Error al obtener los detalles del video:', error.message);
    throw error;
  }
}

function parseVideoDuration(duration){
  const matches = duration.match(/P(\d+D)?T(\d+H)?(\d+M)?(\d+S)?/);
  let newDuration = ""

  const days = parseInt(matches[1]) || 0;
  const hours = parseInt(matches[2]) || 0;
  const minutes = parseInt(matches[3]) || 0;
  const seconds = parseInt(matches[4]) || 0;

  if(days!==0){
    newDuration+=days+ "d. "
  }
  if(hours !==0){
    newDuration+=hours+"h. "
  }
  if(minutes !==0){
    newDuration+=minutes+"m. "
  }
  if(seconds!==0){
    newDuration+=seconds+"s."
  }

  return newDuration
}

function extractVideoId(url) {
  const videoIdRegex = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:(?:[\?&]t=((\d+)m)?(\d+)s)?)?/;
  const match = url.match(videoIdRegex);
  return match && match[1] ? match[1] : null;
}