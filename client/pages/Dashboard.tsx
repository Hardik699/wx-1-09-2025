import AppNav from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-deep-900 via-blue-deep-800 to-slate-900">
      <AppNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400">Overview and quick actions</p>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Employees</p>
                <p className="text-2xl font-semibold text-white">Manage</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Departments</p>
                <p className="text-2xl font-semibold text-white">Overview</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Access</p>
                <p className="text-2xl font-semibold text-white">Admin</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">HR</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-slate-400">
                Manage employee data and departments
              </p>
              <Button
                onClick={() => navigate("/hr")}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Go <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Admin</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-slate-400">Admin tools and settings</p>
              <Button
                onClick={() => navigate("/admin")}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Go <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">System Info</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-slate-400">IT systems overview and records</p>
              <Button
                onClick={() => navigate("/system-info")}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Go <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">PC/Laptop Info</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-slate-400">Track PC and laptop assets</p>
              <Button
                onClick={() => navigate("/pc-laptop-info")}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Go <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
