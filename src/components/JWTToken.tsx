import axios from "axios";

export function SetToken(aToken: string, rToken: string) {
  localStorage.setItem("accessToken", aToken);
  document.cookie = `refreshToken=${rToken}; Path=/;`;
}

export function GetToken(): string | null {
  const accessToken: string | null = localStorage.getItem("accessToken");
  //const refreshToken: string | undefined = getCookieValue("refreshToken");
  console.log(accessToken);
  //console.log(refreshToken);
  return accessToken;
/*
  if(accessToken === null) {
    if(refreshToken === undefined){
      return null; // accessToken = X, refreshToken = X
    }
    else {
      const res = await axios.patch(`${process.env.REACT_APP_SERVER_URL}/tokens`, {
        "refreshToken": refreshToken
      });
      const aTokenExpireDate: number = Date.now() + 1000 * 60 * 60 * 24; // 1D
      const accessToken: object = {
        token: res.data.accessToken,
        expire: aTokenExpireDate
      }
      const accessTokenString: string = JSON.stringify(accessToken);
      localStorage.setItem("accessToken", accessTokenString);
      return res.data.accessToken; // accessToken = X, refreshToken = O
    }
  }
  else {
    const accessToken = JSON.parse(accessTokenString);
    if(Date.now() > accessToken.expire) {
      localStorage.removeItem("accessToken");
      if(refreshToken === undefined) {
        return null; // accessToken = (만료), refreshToken = X
      }
      else {
        const res = await axios.patch(`${process.env.REACT_APP_SERVER_URL}/tokens`, {
          "refreshToken": refreshToken
        });
        const aTokenExpireDate: number = Date.now() + 1000 * 60 * 60 * 24; // 1D
        const accessToken: object = {
          token: res.data.accessToken,
          expire: aTokenExpireDate
        }
        const accessTokenString: string = JSON.stringify(accessToken);
        localStorage.setItem("accessToken", accessTokenString);
        return res.data.accessToken; // accessToken = (만료), refreshToken = O
      }
    }
    else{
      return accessToken.token; // accessToken = O, refreshToken = ?
    }
  }
*/
}

function getCookieValue(cookieName: string): string | undefined {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${cookieName}=`)) {
      return cookie.substring(cookieName.length + 1);
    }
  }
  return undefined;
}
/*
export function RemoveAtoken() {
  localStorage.removeItem("accessToken");
}

export function RemoveRtoken() {
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
*/