import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function redirectIfAuthenticated() {
  const accessToken = (await cookies()).get("accessToken")?.value;
  const refreshToken = (await cookies()).get("refreshToken")?.value;

  if (refreshToken) {
    const res = await fetch("http://localhost:3001/api/user/verify", {
      method: "GET",
      headers: {
        cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
      },
      cache: "no-store",
    });

    if (res.ok) {
      redirect("/protected/HomePage");
    }
  }
}
