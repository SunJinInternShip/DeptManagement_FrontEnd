interface UserInfo {
  accessToken: string | null;
  name: string | null;
}

export async function SetUserInfo(aToken: string, rToken: string, userName: string): Promise<void> {
  localStorage.setItem('accessToken', aToken);
  document.cookie = `refreshToken=${rToken}; Path=/;`;
  localStorage.setItem('name', userName);
};

export function GetUserInfo(): UserInfo {
  const accessToken: string | null = localStorage.getItem("accessToken");
  const name: string | null = localStorage.getItem("name");
  return {accessToken, name};
}

/*
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

export function RemoveAtoken() {
  localStorage.removeItem("accessToken");
}

export function RemoveRtoken() {
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
*/