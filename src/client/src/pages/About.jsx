import { Zap, ShieldCheck, Rabbit } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-gray-900 text-gray-300">
      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight">
            About SnipShare
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            File sharing should be simple. I built this to prove it.
          </p>
        </div>

        {/* Core Principles Section */}
        <div className="grid md:grid-cols-2 gap-8 text-center">
          {/* My Goal */}
          <div className="bg-gray-800 p-8 rounded-2xl shadow-lg">
            <Rabbit className="mx-auto text-indigo-400 mb-4" size={40} />
            <h3 className="text-2xl font-bold text-white">My Goal</h3>
            <p className="mt-2 text-gray-400">
              No sign-ups, no ads, no nonsense. Just a simple tool that simplifies sharing files when you need it.
            </p>
          </div>

          {/* <My> Approach */}
          <div className="bg-gray-800 p-8 rounded-2xl shadow-lg">
            <ShieldCheck className="mx-auto text-indigo-400 mb-4" size={40} />
            <h3 className="text-2xl font-bold text-white">My Approach</h3>
            <p className="mt-2 text-gray-400">
              I believe in privacy. Your files live in a temporary room for 24
              hours and are then permanently deleted.
            </p>
          </div>
        </div>

        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white">
            Why did I build this?
          </h3>
          <p className="mt-4 text-lg text-gray-400">
            I was just tired of our files getting compressed by
            messenger apps or having to log into clunky cloud storage. I wanted
            a space to just drop a file, grab a link, and get on with my day.
            So, I built SnipShare.
          </p>
        </div>
      </div>
    </div>
  );
}
