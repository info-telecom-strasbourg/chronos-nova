import Image from "next/image";

export default async function RoutePage() {
  return (
    <div className="bg-primary">
      Hello world
      <Image src="./logo.svg" alt="Chronos Logo" width={100} height={100} />
    </div>
  );
}
