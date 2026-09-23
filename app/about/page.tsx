import Link from "next/link";
import Navbar from "../components/Navbar";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Page Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="mb-10">
          <p className="text-cyan-600 font-semibold mb-2">
            Surgical Navigation Case Tracker
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            About SNCT
          </h1>

          <p className="text-slate-600 text-base md:text-lg max-w-3xl">
            SNCT is a surgical case tracking application designed to organize
            and review navigation and robotic-assisted surgical cases in one
            centralized interface.
          </p>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-sm">
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

          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-sm">
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

          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Navigation & Robotics
            </h2>

            <p className="text-slate-600 leading-7">
              SNCT is designed around navigation-assisted and robotic-assisted
              procedures, providing a focused interface for reviewing cases
              involving modern surgical technologies.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-sm">
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
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Current Features
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-lg p-5">
              <p className="text-cyan-600 font-bold mb-1">CREATE</p>
              <p className="text-slate-700">Add new surgical cases</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-5">
              <p className="text-cyan-600 font-bold mb-1">READ</p>
              <p className="text-slate-700">
                View and review case records
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-5">
              <p className="text-cyan-600 font-bold mb-1">UPDATE</p>
              <p className="text-slate-700">
                Edit existing case information
              </p>
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
            className="inline-block w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-6 py-3 rounded-lg text-center"
          >
            Back to Dashboard
          </Link>
        </div>

        <footer className="text-xs text-slate-400 mt-10 pb-6">
          SNCT • For educational and simulation use only • Not for clinical
          decision-making
        </footer>
      </section>
    </main>
  );
}