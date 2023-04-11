import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import GitHubLogin from "react-github-login";
import axios from "axios";


const Login = () => {
  const Client_ID_Git = process.env.REACT_APP_GITHUB_CLIENT_ID
  const Client_ID_Google = process.env.REACT_APP_GOOGLE_CLIENT_ID

  console.log(Client_ID_Git);

  const [tokenNeeded, Settokenvar] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  const [user, setUser] = useState([]);
  const [gsign, setg] = useState(false);

  function CustomButton() {
    const handleClick = (event) => {
      event.preventDefault();
      // Call the GitHub login function provided by react-github-login
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${Client_ID_Git}&redirect_uri=${encodeURIComponent(
        window.location.href
      )}&scope=user`;
    };



    return (
<div>
        <button
          onClick={handleClick}
          style={{
            backgroundColor: "#000000",
            color: "#fff",
            border: "none",
            padding: "12px 16px",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          <i class="fa-brands fa-github"></i> Sign in with GitHub
        </button>

        

</div>

      
    );
  }

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParams = urlParams.get("code");
    console.log(codeParams);
    gapi.load("auth2", function () {
      gapi.auth2.init({
        client_id:Client_ID_Google
            });
    });

    if (codeParams && localStorage.getItem("accessToken") === null) {
      async function getAccessToken() {
        await fetch("http://localhost:4000/getAccessToken?code=" + codeParams, {
          method: "GET",
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.access_token) {
              Settokenvar(data.access_token);
              localStorage.setItem("accessToken", data.access_token);
            }
          });
      }
      getAccessToken();
    }

    loginWithGitHub(codeParams);
  }, []);
  const reset = ()=>{
    setg(false)
   var  link = 'http://localhost:3000' 
    window.location.href = link

  }
  const loginWithGitHub = async (code) => {
    try {
      const response = await axios.get("http://localhost:4000/login/github", {
        params: { code },
      });
      const accessToken = response.data.access_token;
      // Use the access token to make requests to the GitHub API
      localStorage.setItem("accessToken", accessToken);

      console.log(accessToken);
      Settokenvar(accessToken)
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleSignIn = () => {
    gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(
        function (googleUser) {
          console.log(googleUser.wt);
          setUser(googleUser.wt);
          setg(!gsign);
          console.log(gsign);
        },
        function (error) {
          console.log(error);
        }
      );
  };
  const onSuccess = (response) => {
    console.log(response);
  };

  const onFailure = (response) => {
    console.error(response);
  };

  async function handleGetUserDetails() {
    console.log(tokenNeeded);
    const responce = await axios.get("http://localhost:4000/getUserdata", {
      headers: {
        Authorization: "Bearer " + tokenNeeded,
      },
    })

    console.log(responce);
    setUserDetails(responce)


  }

  return (
    <div
      className="container"
      style={{
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="container text-center">
        <h2 className="mb-5">Sign In</h2>
        <button
          onClick={handleGoogleSignIn}
          style={{
            backgroundColor: "#4285F4",
            color: "#fff",
            border: "none",
            padding: "12px 16px",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          <i class="fa-brands fa-google"></i> &nbsp; Sign in with Google
        </button>
        <div>
          <div className="mt-3">
            <GitHubLogin
              clientId= {Client_ID_Git}
              onSuccess={onSuccess}
              onFailure={onFailure}
              redirectUri="http://localhost:3000"
              children={<CustomButton />}
              border="none"
            />
          </div>
        </div>
      </div>
      <div>
      <button className="mt-4"
        onClick={reset}
          style={{
            backgroundColor: "#000000",
            color: "#fff",
            border: "none",
            padding: "12px 16px",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          <i class="fa-solid fa-rotate"></i> &nbsp; Reset
        </button>
        {gsign ? (
          <div>
            <div className="container mt-3 text-center">
              <h2>User Details</h2>
              <img src={user.hK} alt="imag" />
              <p>Name: {user.Ad}</p>
              <p>Email: {user.cu}</p>
            </div>
          </div>
        ) : (
          ""
        )}

        {tokenNeeded ? (
          <div className="container mt-3 text-center">
            <button
              onClick={handleGetUserDetails}
              style={{
                backgroundColor: "#000000",
                color: "#fff",
                border: "none",
                padding: "12px 16px",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              View user details
            </button>
          </div>
        ) : (
          ""
        )}

        {
          userDetails?<div className="container mt-3 text-center">
            <img height="200px" src={userDetails.data.avatar_url} alt="" />
            <h4>Email: {userDetails.data.email}</h4>
            <h5>Link to account : {userDetails.data.html_url}</h5>

          </div>
        :""}
      </div>
    </div>
  );
};

export default Login;
