import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("accessToken")?.value;
  const refreshToken = (await cookieStore).get("refreshToken")?.value;

  if (!refreshToken) return redirect("/public/login");

  const res = await fetch("http://localhost:3001/api/user/verify", {
    method: "GET",
    headers: {
      cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return redirect("/public/login");

  const data = await res.json();
  if (!data.valid) return redirect("/public/login");

  return <>{children}</>;
}
