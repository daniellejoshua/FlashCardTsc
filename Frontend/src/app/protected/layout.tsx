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

  return <>{children}</>;
}
