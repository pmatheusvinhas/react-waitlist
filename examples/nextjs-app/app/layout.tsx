import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'React Waitlist Examples',
  description: 'Examples of using the React Waitlist component in different scenarios',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <a href="/" className="text-xl font-bold">React Waitlist</a>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="/" className="hover:underline">Home</a></li>
                <li><a href="https://github.com/resendlabs/react-waitlist" target="_blank" className="hover:underline">GitHub</a></li>
                <li><a href="/docs" className="hover:underline">Documentation</a></li>
              </ul>
            </nav>
          </div>
        </header>
        {children}
        <footer className="bg-gray-100 p-4 mt-8">
          <div className="container mx-auto text-center text-gray-600">
            <p>© {new Date().getFullYear()} Resend Labs. All rights reserved.</p>
            <p className="text-sm mt-2">
              <a href="https://resend.com" target="_blank" className="text-blue-600 hover:underline">Resend</a> | 
              <a href="https://github.com/resendlabs/react-waitlist" target="_blank" className="text-blue-600 hover:underline ml-2">GitHub</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
} 