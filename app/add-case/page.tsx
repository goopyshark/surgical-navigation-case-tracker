export default function AddCasePage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <nav className="bg-slate-950 text-white px-6 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500 rounded-xl w-10 h-10 flex items-center justify-center font-bold">
            +
          </div>
          <span className="text-2xl font-bold">SNCT</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm">
          <a href="/" className="hover:text-cyan-400">
            Dashboard
          </a>
          <a href="/cases" className="hover:text-cyan-400">
            Cases
          </a>
          <a
            href="/add-case"
            className="bg-cyan-500 px-5 py-2 rounded-lg"
          >
            Add Case
          </a>
          <a href="/about" className="hover:text-cyan-400">
            About
          </a>
          <span className="text-slate-400">Logout</span>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 py-8">
        <div>
          <h1 className="text-4xl font-bold border-l-4 border-cyan-500 pl-4">
            Add Surgical Case
          </h1>
          <p className="text-slate-500 mt-3 text-lg">
            Enter the details for a new surgical navigation or robotic-assisted
            case.
          </p>
        </div>

        <form className="mt-8 bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2">Case Name</label>
              <input
                type="text"
                placeholder="Example: Scoliosis Fusion"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Procedure</label>
              <input
                type="text"
                placeholder="Example: Posterior Spinal Fusion"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Region</label>
              <select className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white">
                <option value="">Select region</option>
                <option>Spine</option>
                <option>Cranial</option>
                <option>Cervical</option>
                <option>Thoracic</option>
                <option>Lumbar</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">Technology Type</label>
              <select className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white">
                <option value="">Select technology</option>
                <option>Navigation</option>
                <option>Robotic</option>
                <option>Navigation + Robotic</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">Case Date</label>
              <input
                type="date"
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                placeholder="Example: 120"
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">System Name</label>
              <input
                type="text"
                placeholder="Navigation or robotic system"
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Registration Method
              </label>
              <input
                type="text"
                placeholder="Example: Surface matching"
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Navigation Accuracy (mm)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="Example: 1.2"
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Status</label>
              <select className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white">
                <option>Planned</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block font-medium mb-2">Technical Issues</label>
            <textarea
              rows={4}
              placeholder="Describe any technical issues encountered..."
              className="w-full border border-slate-300 rounded-lg px-4 py-3"
            />
          </div>

          <div className="mt-6">
            <label className="block font-medium mb-2">Notes</label>
            <textarea
              rows={4}
              placeholder="Additional case notes..."
              className="w-full border border-slate-300 rounded-lg px-4 py-3"
            />
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <a
              href="/cases"
              className="border border-slate-300 px-6 py-3 rounded-lg text-center"
            >
              Cancel
            </a>

            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Save Case
            </button>
          </div>
        </form>

        <footer className="text-xs text-slate-400 mt-8 pb-6">
          SNCT • For educational and simulation use only • Not for clinical
          decision-making
        </footer>
      </section>
    </main>
  );
}