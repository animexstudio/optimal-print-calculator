import React from 'react';
import OptimalPrintCalculator from './components/OptimalPrintCalculator';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Optimal Print Size Calculator</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow p-6">
              <OptimalPrintCalculator />
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white border-t mt-10">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Optimal Print Size Calculator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;