/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { RightCanvas } from './components/RightCanvas';

export default function App() {
  const [customSnippet, setCustomSnippet] = useState<string | undefined>(undefined);

  const handlePushToCanvas = (code: string) => {
    setCustomSnippet(code);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Application Header */}
      <Header />

      {/* Main Split-View Workspace: Left Command Center + Right Mobile Device Canvas */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <LeftPanel onPushToCanvas={handlePushToCanvas} />
        <RightCanvas customSnippet={customSnippet} />
      </main>
    </div>
  );
}
