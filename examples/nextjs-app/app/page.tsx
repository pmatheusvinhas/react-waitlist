import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-8 text-center">React Waitlist Examples</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {examples.map((example) => (
            <Link 
              key={example.path} 
              href={example.path}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{example.title}</h2>
              <p className="text-gray-600 mb-4">{example.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-600">View example →</span>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{example.level}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

const examples = [
  {
    title: "Basic Waitlist Form",
    description: "A simple waitlist form with minimal configuration",
    path: "/examples/basic",
    level: "Beginner"
  },
  {
    title: "Custom Fields",
    description: "Waitlist form with custom fields and validation",
    path: "/examples/custom-fields",
    level: "Beginner"
  },
  {
    title: "Custom Styling",
    description: "Waitlist form with custom theme and styling",
    path: "/examples/styling",
    level: "Intermediate"
  },
  {
    title: "Event Handling",
    description: "Waitlist form with event callbacks and analytics",
    path: "/examples/events",
    level: "Intermediate"
  },
  {
    title: "reCAPTCHA Integration",
    description: "Waitlist form with Google reCAPTCHA protection",
    path: "/examples/recaptcha",
    level: "Advanced"
  },
  {
    title: "Webhook Integration",
    description: "Waitlist form with webhook notifications",
    path: "/examples/webhooks",
    level: "Advanced"
  },
  {
    title: "Server Component",
    description: "Using the waitlist form as a server component",
    path: "/examples/server",
    level: "Advanced"
  },
  {
    title: "Complete Example",
    description: "A complete example with all features enabled",
    path: "/examples/complete",
    level: "Expert"
  }
]; 