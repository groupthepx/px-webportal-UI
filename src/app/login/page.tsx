import LoginPage from "@/content/login/Login";
import { Suspense } from "react";



export default function Home() {
  return (
    <>

      <Suspense fallback={null}><LoginPage /> </Suspense>
    </>

  );
}
