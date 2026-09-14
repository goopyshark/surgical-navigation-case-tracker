import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-slate-900 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold">
              +
            </div>
            <span className="text-xl font-bold">SNCT</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-cyan-400">
              Dashboard
            </Link>

            <Link href="/cases" className="hover:text-cyan-400">
              Cases
            </Link>

            <Link href="/add-case" className="hover:text-cyan-400">
              Add Case
            </Link>

            <Link
              href="/about"
              className="bg-cyan-600 px-4 py-2 rounded-lg font-medium"
            >
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-cyan-600 font-semibold mb-2">
            Surgical Navigation Case Tracker
          </p>

          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            About SNCT
          </h1>

          <p className="text-slate-600 text-lg max-w-3xl">
            SNCT is a surgical case tracking application designed to organize
            and review navigation and robotic-assisted surgical cases in one
            centralized interface.
          </p>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white border border-slate-200 rounded-xl p-7 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Project Purpose
            </h2>

            <p className="text-slate-600 leading-7">
              Surgical navigation and robotic technologies generate important
              information about procedures, case types, surgical regions, and
              operating times. SNCT provides a simple way to organize this
              information and review previous cases.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-7 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Case Management
            </h2>

            <p className="text-slate-600 leading-7">
              The application provides an interface for creating, viewing,
              editing, and managing surgical case records. Cases can include
              information such as procedure, surgical region, navigation type,
              date, duration, and status.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-7 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Navigation & Robotics
            </h2>

            <p className="text-slate-600 leading-7">
              SNCT is designed around navigation-assisted and robotic-assisted
              procedures, providing a focused interface for reviewing cases
              involving modern surgical technologies.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-7 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Project Development
            </h2>

            <p className="text-slate-600 leading-7">
              This project is being developed as a responsive web application
              using Next.js and TypeScript. The interface is designed to work
              across desktop and mobile screen sizes while supporting future
              integration with persistent case data.
            </p>
          </div>
        </div>

        {/* Current Features */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Current Features
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-lg p-5">
              <p className="text-cyan-600 font-bold mb-1">CREATE</p>
              <p className="text-slate-700">Add new surgical cases</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-5">
              <p className="text-cyan-600 font-bold mb-1">READ</p>
              <p className="text-slate-700">View and review case records</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-5">
              <p className="text-cyan-600 font-bold mb-1">UPDATE</p>
              <p className="text-slate-700">Edit existing case information</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-5">
              <p className="text-cyan-600 font-bold mb-1">DELETE</p>
              <p className="text-slate-700">Manage case removal</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-6 py-3 rounded-lg"
          >
            Back to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}