

# 🌍 IP & Weather Tracking App


Live Demo: [ip-weather-tracking.netlify.app](https://ip-weather-tracking.netlify.app/)

A clean and interactive **IP & Weather Tracking App** that provides real-time location information and weather forecasts for any given IP address. Built using **React**, **Leaflet.js**, and **OpenWeatherMap** API, it comes with additional features like dark mode, geolocation support, and search history.

## 🚀 Features
- **IP Tracking**: Retrieve detailed location data for any IP address, including the city, region, and country.
- **Real-Time Weather Forecast**: View the current weather conditions and a 3-day forecast for the selected location.
- **Geolocation Support**: Fetch your current location using the browser's geolocation services.
- **Dark Mode**: Toggle between light and dark themes for a customized viewing experience.
- **Interactive Map**: Visualize the IP location using **Leaflet.js**.
- **Search History**: Track previously searched IP addresses with date and time stamps.
- **Smooth Animations**: Enjoy elegant UI transitions using **Framer Motion**.

## 🛠️ Technologies Used
- **React**: JavaScript library for building user interfaces.
- **Leaflet.js**: An open-source library for rendering interactive maps.
- **Framer Motion**: Animation library for creating smooth UI transitions.
- **OpenWeatherMap API**: Provides real-time weather data and forecasts.
- **IPInfo API**: Retrieves detailed IP location data.

## 🌐 Live Demo
Check out the live version of the app here:  
🔗 **[IP & Weather Tracking App](https://ip-weather-tracking.netlify.app/)**

## 🔧 Setup Instructions

### Prerequisites
- **Node.js** (v14 or higher)
- **NPM** or **Yarn** package manager

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Asad-013/ip-tracker-app.git
   cd ip-tracker-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up API keys**:
   - Create a `.env` file in the root of your project.
   - Add the following variables to your `.env` file:
     ```bash
     REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key
     REACT_APP_IPINFO_API_KEY=your_ipinfo_api_key
     ```

4. **Run the app**:
   ```bash
   npm start
   ```
   The app will start at `http://localhost:3000`.

### Building for Production
To create an optimized production build:
```bash
npm run build
```
This will create a `build/` folder with your optimized production files.

## 🖥️ Deployment

### Deploy on Netlify
To deploy the app on **Netlify**, follow these steps:
1. Fork the repository and push the code to your GitHub account.
2. Create a new site on [Netlify](https://www.netlify.com/) and connect it to your GitHub repository.
3. Set your environment variables in the Netlify settings for the API keys.
4. Build and deploy your app directly through Netlify.

## 📜 License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more information.

## 🙌 Contributions
Contributions are welcome! Feel free to fork the repository and submit a pull request with any improvements.
