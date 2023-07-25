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

    // Realiza la solicitud a la API de YouTube Data para obtener la información del video
    const response = await youtube.videos.list({
      part: 'snippet',
      id: videoId
    });


    // Extrae los datos del video de la respuesta
    const videoData = response.data.items[0].snippet;

    // Obtiene el título, autor y URL de la imagen del video
    const title = videoData.title;
    const author = videoData.channelTitle;
    const imageUrl = videoData.thumbnails.medium.url;
    const description = videoData.description;
    const publishedDate = videoData.publishedAt

    // Devuelve los datos del video
    return {
      title: title,
      author: author,
      imageUrl: imageUrl,
      description: description,
      publishedDate: publishedDate

    };
  } catch (error) {
    console.error('Error al obtener los detalles del video:', error.message);
    throw error;
  }
}

function extractVideoId(url) {
  const videoIdRegex = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:(?:[\?&]t=((\d+)m)?(\d+)s)?)?/;
  const match = url.match(videoIdRegex);
  return match && match[1] ? match[1] : null;
}