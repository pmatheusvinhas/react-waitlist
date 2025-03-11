import React, { useState } from 'react';
import Link from 'next/link';
import CodeBlock from './CodeBlock';

interface ExampleLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  clientCode?: string;
  serverCode?: string;
  apiCode?: string;
  previousExample?: string;
  nextExample?: string;
}

export default function ExampleLayout({
  title,
  description,
  children,
  clientCode,
  serverCode,
  apiCode,
  previousExample,
  nextExample,
}: ExampleLayoutProps) {
  const [activeTab, setActiveTab] = useState<'client' | 'server' | 'api'>(
    clientCode ? 'client' : serverCode ? 'server' : 'api'
  );

  return (
    <div className="example-container">
      <div className="example-header">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="example-content">
        <div className="example-form">
          {children}
        </div>

        <div className="example-code">
          <div className="example-tabs">
            {clientCode && (
              <div
                className={`example-tab ${activeTab === 'client' ? 'active' : ''}`}
                onClick={() => setActiveTab('client')}
              >
                Client Component
              </div>
            )}
            {serverCode && (
              <div
                className={`example-tab ${activeTab === 'server' ? 'active' : ''}`}
                onClick={() => setActiveTab('server')}
              >
                Server Component
              </div>
            )}
            {apiCode && (
              <div
                className={`example-tab ${activeTab === 'api' ? 'active' : ''}`}
                onClick={() => setActiveTab('api')}
              >
                API Route
              </div>
            )}
          </div>

          {activeTab === 'client' && clientCode && (
            <CodeBlock
              code={clientCode}
              language="tsx"
              fileName="app/examples/[example]/client.tsx"
            />
          )}

          {activeTab === 'server' && serverCode && (
            <CodeBlock
              code={serverCode}
              language="tsx"
              fileName="app/examples/[example]/page.tsx"
            />
          )}

          {activeTab === 'api' && apiCode && (
            <CodeBlock
              code={apiCode}
              language="ts"
              fileName="app/api/[endpoint]/route.ts"
            />
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
        {previousExample ? (
          <Link href={previousExample} className="text-blue-600 hover:underline">
            ← Previous Example
          </Link>
        ) : (
          <div></div>
        )}
        {nextExample ? (
          <Link href={nextExample} className="text-blue-600 hover:underline">
            Next Example →
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
} 