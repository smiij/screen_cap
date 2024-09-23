import { useState } from 'react'
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY
import viteLogo from '/vite.svg'
import './App.css'
import APIForm from '../components/APIForm'
import Gallery from '../components/Gallery'


function App() {
  const [screenshot, setScreenshot] = useState(null)
  const [previous, setPrevious] = useState([])
  const [quota, setQuotaCount] = useState(null)

  const [inputs, setInputs] = useState({
    url: "",
    format: "",
    no_ads: "",
    no_cookie_banners: "",
    width: "",
    height: "",
  });

  const submitForm = () => {
    let defaultValues = {
      format: "jpeg",
      no_ads: "true",
      no_cookie_banners: "false",
      width: "1920",
      height: "1080",
    }  

    if (inputs.url == "" || inputs.url == " "){
      alert("Please input a URL");
    }

    else {
      for (const [key, value] of Object.entries(inputs)) {
        if (value == "") {
          inputs[key] = defaultValues[key]
          }
        }

      console.log(inputs);
      console.log("Access Key:", ACCESS_KEY);
      
      makeQuery();
    }
  }
  
  const makeQuery = () => {
    let wait_until = "network_idle";
    let response_type = "json";
    let fail_on_status = "400%2C404%2C500-511";
    let url_starter = "https://";
    let fullURL = url_starter + inputs.url;
    let query = `https://api.apiflash.com/v1/urltoimage?access_key=${ACCESS_KEY}&url=${fullURL}&format=${inputs.format}&width=${inputs.width}&height=${inputs.height}&no_cookie_banners=${inputs.no_cookie_banners}&no_ads=${inputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;
    console.log("URL:", inputs.url);
    callApI(query).catch(console.error);

  }

    const callApI = async (query) => {
      const response = await fetch(query);
      const json = await response.json();
      const time = console.log(json);

      if (json.url == null){
        alert("There was an error with your request. Please try again.")
      }
      else {
        setScreenshot(json.url);
        setPrevious((images) => [...images, json.url]);
        reset();
        updateQuota();


      }
    }

    const reset = () => {
       setInputs({
        url: "",
        format: "",
        no_ads: "",
        no_cookie_banners: "",
        width: "",
        height: "",
      });
    }

    const updateQuota = async () => {
      const response = await fetch("https://api.apiflash.com/v1/urltoimage/quota?access_key=" + ACCESS_KEY);
      const result = await response.json();
      setQuotaCount(result);
    }


  return (
    <div className='whole-page'>
      <h1>Build Your Own Screenshot! 📸</h1>

      <APIForm
        inputs={inputs}
        handleChange={(e) =>
          setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value.trim(),
          }))
        }
        onSubmit={submitForm}
      />
      {screenshot ? (
        <img
        className='screenshot'
        src={screenshot}
        alt="Screenshot returned"
        />
      ) : (
        <div></div>
      )}

      <div className='container'>
        {quota ? (
          <p className='quota'>
            {" "}
            API Calls remaining: {quota.remaining} out of {quota.limit}
          </p>
        ) : (
          <p> </p>
        )}
        <h3> Current Query Status: </h3>
        <p>
          https://api.apiflash.com/v1.urltoimage?access_key=ACCESS_KEY
          <br></br>
          &url={inputs.url} <br></br>
          &format={inputs.format} <br></br>
          &width={inputs.width} <br></br>
          &height={inputs.height} <br></br>
          &no_cookie_banners={inputs.no_cookie_banners} <br></br>
          &no_ads={inputs.no_ads} <br></br>
          <br></br>
        </p>
        </div>
        <div className='container'>
          <Gallery images={previous} />
        </div>
      <br></br>
    </div>
  )
}

export default App
