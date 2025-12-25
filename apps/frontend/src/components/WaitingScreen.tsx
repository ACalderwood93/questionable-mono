export function WaitingScreen() {
  return (
    <section className="bg-gray-800 border-4 border-white rounded-lg p-6">
      <p className="mb-4">WAITING FOR OTHER QUESTERS...</p>
      <div className="w-full bg-gray-700 border-2 border-gray-600 h-4 mb-4">
        <div className="bg-blue-600 h-full w-1/2"></div>
      </div>
      <div className="text-center mt-4">
        <span className="text-6xl">👤</span>
      </div>
    </section>
  );
}
