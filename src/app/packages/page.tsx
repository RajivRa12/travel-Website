import { Suspense } from "react";
import AllPackagesClient from "./AllPackagesClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllPackagesClient />
    </Suspense>
  );
}
