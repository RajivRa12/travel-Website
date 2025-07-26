import { packages as allPackages } from "@/lib/data";
import { notFound } from "next/navigation";

export default function PaymentPage({ params }: { params: { packageId: string } }) {
  const pkg = allPackages.find(p => p.id === Number(params.packageId));
  if (!pkg) return notFound();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8">
      <h1 className="text-2xl font-bold mb-4">Payment for: {pkg.title}</h1>
      <div className="mb-6">
        <p className="mb-2">Destination: {pkg.destination}</p>
        <p className="mb-2">Duration: {pkg.duration}</p>
        <p className="mb-2 font-bold">Amount: <span className="rupee-font">₹{pkg.price}</span></p>
      </div>
      <form className="w-full max-w-sm space-y-4 bg-white p-6 rounded shadow">
        <input type="text" placeholder="Name" className="w-full border rounded p-2" required />
        <input type="email" placeholder="Email" className="w-full border rounded p-2" required />
        <input type="text" placeholder="Payment Details (Card/UPI)" className="w-full border rounded p-2" required />
        <button type="submit" className="w-full bg-primary text-white py-2 rounded font-bold">Pay Now</button>
      </form>
    </div>
  );
} 