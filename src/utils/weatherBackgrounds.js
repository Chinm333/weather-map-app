import clear from '../assets/images/clear.jpg'
import cloudy from '../assets/images/cloudy.jpg';
import rainy from '../assets/images/rainy.jpg';
import snowy from '../assets/images/snowy.jpg';
import sunny from '../assets/images/sunny.jpg';

const weatherBackgrounds = {
  Clear: clear,
  Clouds: cloudy,
  Rain: rainy,
  Snow: snowy,
  Sunny: sunny,
};

export const getBackgroundImage = (weatherCondition) => {
  return weatherBackgrounds[weatherCondition] || clear; 
};