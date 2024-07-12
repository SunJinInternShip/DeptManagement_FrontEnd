import * as React from 'react';

interface UserInfo {
  accessToken: string | null;
  name: string | null;
}

// 로그인 시, 서버로부터 받은 유저 정보(accesstoken, refreshtoken, username)를 localStorage와 cookie로 저장
export async function SetUserInfo(aToken: string, rToken: string, userName: string): Promise<void> {
  localStorage.setItem('accessToken', aToken);
  document.cookie = `refreshToken=${rToken}; Path=/;`; // 현재는 보안없이 저장, 수정 필요
  localStorage.setItem('name', userName);
};

// 유저 정보 get
export function GetUserInfo(): UserInfo {
  const accessToken: string | null = localStorage.getItem("accessToken");
  const name: string | null = localStorage.getItem("name");
  return {accessToken, name};
}

// 로그아웃 시, 유저 정보 remove
export async function RemoveUserInfo(): Promise<void> {
  localStorage.removeItem("accessToken");
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  localStorage.removeItem("name");
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
*/