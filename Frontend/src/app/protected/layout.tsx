import { redirect } from "next/navigation";
import { cookies } from "next/headers";
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("accessToken")?.value;
  if (!token) return redirect("/public/login");
  const res = await fetch("http://localhost:3001/api/user/verify", {
    method: "GET",
    headers: {
      cookie: `accessToken=${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) return redirect("/public/login");
  const data = await res.json();
  if (!data.valid) return redirect("/public/login");

  return <>{children}</>;
}
