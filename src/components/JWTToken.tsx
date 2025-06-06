import axios from "axios";

interface UserInfo {
  accessToken: string | null;
  name: string | null;
  role: string | null;
}

// 로그인 시, 서버로부터 받은 유저 정보(accesstoken, refreshtoken, username, userrole)를 localStorage와 cookie로 저장
export function SetUserInfo(aToken: string, rToken: string, userName: string | null, role: string | null): boolean {
  try {
    localStorage.setItem('accessToken', aToken);
    document.cookie = `refreshToken=${rToken}; Path=/;`; // 현재는 보안없이 저장, 수정 필요
    if(userName) localStorage.setItem('name', userName); // 토큰 재발급 시에 유저이름이 null
    if(role) localStorage.setItem('role', role); // 토큰 재발급 시에 유저 역할이 null
    return true
  } catch (error) {
    console.log("유저 정보 저장 실패:", error)
    return false
  }
};

// 유저 정보 get
export function GetUserInfo(): UserInfo {
  const accessToken: string | null = localStorage.getItem("accessToken");
  const name: string | null = localStorage.getItem("name");
  const role: string | null = localStorage.getItem("role");
  return {accessToken, name, role};
}

// 리프레시 토큰 get | 보안 문제로 수정 필요
function GetRefreshToken(): string | null {
  const cookies = document.cookie.split('; ')
  for(const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if(key === "refreshToken") return value
  }
  return null
}

// 리프레시 토큰으로 토큰 재발급 | 보안 문제로 수정 필요
export async function reissueTokens(): Promise<number | null> {
  const refreshToken = GetRefreshToken()
  if(refreshToken !== null) {
    try {
      const res = await axios.patch(`${process.env.REACT_APP_SERVER_URL}/tokens`, {}, {
        headers: {
          'Refresh-Token': refreshToken
        }
      });
      const setUserInfoResult = SetUserInfo(res.data.accessToken, res.data.refreshToken, res.data.userName, res.data.role)
      if(setUserInfoResult) return res.status
    } catch (error: unknown) {
      if(axios.isAxiosError(error) && error.response) {
        console.log(error)
        return error.response?.status
      }
    }
  }
  return null
}

// 로그아웃 시, 유저 정보 remove
export function RemoveUserInfo(): boolean {
  try {
    localStorage.removeItem("accessToken");
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    return true
  } catch (error) {
    console.log("유저 정보 삭제 실패:", error)
    return false
  }
}
