export default function Footer() {
  const currentYear: number = new Date().getFullYear();

  return (
    <div className="flex justify-center bg-gray-50 text-green-800 text-xs p-4">
      Periscope&copy; {currentYear}
    </div>
  );
}
