import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* header section */}
      <header className="bg-black text-white">
        <h1>i'm header section </h1>
      </header>

      {/* main content section */}
      <main>
        <h1>i'm main section</h1>
      </main>

      {/* footer section */}
      <footer className="bg-black text-white py-6 ">
        <h1>i'm footer section </h1>
      </footer>
    </>
  );
}
