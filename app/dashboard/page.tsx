import RequireAuth from "../../components/auth/RequireAuth";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-black text-white p-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Welcome to your CubeTech dashboard. Features coming soon.
        </p>
      </div>
    </RequireAuth>
  );
}
