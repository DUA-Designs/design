import { useState } from "react";
import {
  Home,
  Users,
  Activity,
  FileText,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Pill,
  Search,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Patient {
  id: string;
  name: string;
  age: number;
  lastBP: { systolic: number; diastolic: number };
  trend: "up" | "down" | "stable";
  adherence: number;
  status: "good" | "warning" | "alert";
  lastVisit: string;
}

const patients: Patient[] = [
  {
    id: "1",
    name: "Sarah Begay",
    age: 45,
    lastBP: { systolic: 120, diastolic: 80 },
    trend: "stable",
    adherence: 95,
    status: "good",
    lastVisit: "2 days ago",
  },
  {
    id: "2",
    name: "James Tsosie",
    age: 58,
    lastBP: { systolic: 145, diastolic: 92 },
    trend: "up",
    adherence: 75,
    status: "warning",
    lastVisit: "1 week ago",
  },
  {
    id: "3",
    name: "Mary Yazzie",
    age: 62,
    lastBP: { systolic: 165, diastolic: 98 },
    trend: "up",
    adherence: 60,
    status: "alert",
    lastVisit: "3 days ago",
  },
  {
    id: "4",
    name: "Tom Nez",
    age: 51,
    lastBP: { systolic: 118, diastolic: 76 },
    trend: "down",
    adherence: 90,
    status: "good",
    lastVisit: "1 day ago",
  },
  {
    id: "5",
    name: "Lisa Joe",
    age: 47,
    lastBP: { systolic: 135, diastolic: 88 },
    trend: "stable",
    adherence: 85,
    status: "warning",
    lastVisit: "4 days ago",
  },
];

const bpHistory = [
  { date: "Jan 1", systolic: 145, diastolic: 90 },
  { date: "Jan 8", systolic: 142, diastolic: 88 },
  { date: "Jan 15", systolic: 138, diastolic: 86 },
  { date: "Jan 22", systolic: 132, diastolic: 84 },
  { date: "Jan 29", systolic: 128, diastolic: 82 },
  { date: "Feb 5", systolic: 125, diastolic: 80 },
  { date: "Feb 12", systolic: 120, diastolic: 80 },
];

export function ClinicianDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    patients[0]
  );
  const [activeTab, setActiveTab] = useState("patients");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "#5ec962";  // Leaf green
      case "warning":
        return "#a5db36";  // Lime
      case "alert":
        return "#fde725";  // Yellow
      default:
        return "#5ec962";
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const alertCount = patients.filter((p) => p.status === "alert").length;
  const warningCount = patients.filter((p) => p.status === "warning").length;

  return (
    <div className="min-h-screen bg-[#440154] flex">
      {/* Left Sidebar Navigation */}
      <div className="w-64 bg-[#3b528b] border-r border-[#482475] flex flex-col">
        <div className="p-6 border-b border-[#482475]">
          <h1 className="text-2xl font-extrabold text-[#fde725]">
            Cardio Care Quest
          </h1>
          <p className="text-sm text-[#a5db36] mt-1">Clinician Portal</p>
        </div>

        <nav className="flex-1 p-4">
          <button
            onClick={() => setActiveTab("patients")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-colors ${
              activeTab === "patients"
                ? "bg-[#21918c] text-[#fde725]"
                : "text-[#a5db36] hover:bg-[#482475]"
            }`}
          >
            <Users size={20} />
            <span className="font-semibold">Patients</span>
          </button>
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-colors ${
              activeTab === "overview"
                ? "bg-[#21918c] text-[#fde725]"
                : "text-[#a5db36] hover:bg-[#482475]"
            }`}
          >
            <Home size={20} />
            <span className="font-semibold">Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-colors ${
              activeTab === "reports"
                ? "bg-[#21918c] text-[#fde725]"
                : "text-[#a5db36] hover:bg-[#482475]"
            }`}
          >
            <FileText size={20} />
            <span className="font-semibold">Reports</span>
          </button>
        </nav>

        {/* Alerts Summary */}
        <div className="p-4 border-t border-[#482475]">
          <div className="bg-[#482475] rounded-xl p-4 mb-2 border-2 border-[#fde725]">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={20} className="text-[#fde725]" />
              <span className="font-bold text-[#fde725]">Alerts</span>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-2xl font-extrabold text-[#fde725]">
                  {alertCount}
                </p>
                <p className="text-xs text-[#a5db36]">Critical</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#a5db36]">
                  {warningCount}
                </p>
                <p className="text-xs text-[#5ec962]">Warning</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Patient List */}
        <div className="w-96 bg-[#3b528b] border-r border-[#482475] flex flex-col">
          <div className="p-6 border-b border-[#482475]">
            <h2 className="text-xl font-bold text-[#fde725] mb-4">
              Patient List
            </h2>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a5db36]"
                size={20}
              />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#482475] rounded-xl text-[#fde725] placeholder:text-[#5a1a6f] focus:outline-none focus:ring-2 focus:ring-[#fde725]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`w-full p-4 border-b border-[#482475] hover:bg-[#482475] transition-colors text-left ${
                  selectedPatient?.id === patient.id ? "bg-[#482475]" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-[#fde725]">{patient.name}</h3>
                    <p className="text-sm text-[#a5db36]">Age: {patient.age}</p>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getStatusColor(patient.status) }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#fde725]">
                      {patient.lastBP.systolic}/{patient.lastBP.diastolic}
                    </p>
                    <p className="text-xs text-[#a5db36]">
                      {patient.lastVisit}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {patient.trend === "up" ? (
                      <TrendingUp size={16} className="text-[#fde725]" />
                    ) : patient.trend === "down" ? (
                      <TrendingDown size={16} className="text-[#5ec962]" />
                    ) : (
                      <div className="w-4 h-0.5 bg-[#a5db36]" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Patient Details */}
        <div className="flex-1 overflow-y-auto p-8">
          {selectedPatient ? (
            <>
              {/* Patient Header */}
              <div className="bg-[#3b528b] rounded-2xl p-6 shadow-lg mb-6 border-2 border-[#fde725]">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-[#fde725] mb-2">
                      {selectedPatient.name}
                    </h2>
                    <div className="flex gap-4 text-sm text-[#a5db36]">
                      <span>Age: {selectedPatient.age}</span>
                      <span>•</span>
                      <span>Last Visit: {selectedPatient.lastVisit}</span>
                    </div>
                  </div>
                  <div
                    className="px-4 py-2 rounded-full font-bold text-[#440154]"
                    style={{
                      backgroundColor: getStatusColor(selectedPatient.status),
                    }}
                  >
                    {selectedPatient.status.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* BP Card */}
                <div className="bg-[#3b528b] rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity size={20} className="text-[#fde725]" />
                    <h3 className="font-semibold text-[#a5db36]">
                      Blood Pressure
                    </h3>
                  </div>
                  <p className="text-4xl font-extrabold text-[#fde725]">
                    {selectedPatient.lastBP.systolic}/
                    {selectedPatient.lastBP.diastolic}
                  </p>
                  <p className="text-sm text-[#a5db36] mt-1">mmHg</p>
                </div>

                {/* Adherence Card */}
                <div className="bg-[#3b528b] rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Pill size={20} className="text-[#a5db36]" />
                    <h3 className="font-semibold text-[#a5db36]">
                      Medication Adherence
                    </h3>
                  </div>
                  <p className="text-4xl font-extrabold text-[#fde725]">
                    {selectedPatient.adherence}%
                  </p>
                  <div className="mt-2 h-2 bg-[#482475] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#a5db36] rounded-full"
                      style={{ width: `${selectedPatient.adherence}%` }}
                    />
                  </div>
                </div>

                {/* Trend Card */}
                <div className="bg-[#3b528b] rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown size={20} className="text-[#21918c]" />
                    <h3 className="font-semibold text-[#a5db36]">
                      BP Trend
                    </h3>
                  </div>
                  <p className="text-4xl font-extrabold text-[#5ec962]">
                    {selectedPatient.trend === "down" ? "↓" : selectedPatient.trend === "up" ? "↑" : "→"}
                  </p>
                  <p className="text-sm text-[#a5db36] mt-1 capitalize">
                    {selectedPatient.trend}
                  </p>
                </div>
              </div>

              {/* BP History Chart */}
              <div className="bg-[#3b528b] rounded-2xl p-6 shadow-lg mb-6">
                <h3 className="text-lg font-bold text-[#fde725] mb-4">
                  Blood Pressure History (Last 6 Weeks)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bpHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#482475" />
                    <XAxis
                      dataKey="date"
                      stroke="#a5db36"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#a5db36" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#3b528b",
                        border: "2px solid #fde725",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        color: "#fde725",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="systolic"
                      stroke="#fde725"
                      strokeWidth={3}
                      dot={{ fill: "#fde725", r: 5 }}
                      id="clinician-systolic-line"
                    />
                    <Line
                      type="monotone"
                      dataKey="diastolic"
                      stroke="#21918c"
                      strokeWidth={3}
                      dot={{ fill: "#21918c", r: 5 }}
                      id="clinician-diastolic-line"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Medication Schedule */}
              <div className="bg-[#3b528b] rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-[#fde725] mb-4">
                  Current Medications
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Lisinopril", dose: "10mg", frequency: "Once daily" },
                    { name: "Metformin", dose: "500mg", frequency: "Twice daily" },
                    { name: "Aspirin", dose: "81mg", frequency: "Once daily" },
                  ].map((med, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-[#482475] rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#a5db36] flex items-center justify-center">
                          <Pill size={20} className="text-[#440154]" />
                        </div>
                        <div>
                          <p className="font-bold text-[#fde725]">{med.name}</p>
                          <p className="text-sm text-[#a5db36]">{med.dose}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[#a5db36]">
                        {med.frequency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-[#a5db36]">Select a patient to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
