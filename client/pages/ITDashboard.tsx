import AppNav from "@/components/Navigation";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServerCog, User, Building2, Plus, ArrowRight } from "lucide-react";

interface ITRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  systemId: string;
  tableNumber: string;
  department: string;
  emails: { email: string; password: string }[];
  vitelGlobal: {
    id: string;
    password: string;
    type: string;
    extNumber?: string;
  };
  lmPlayer: { id: string; password: string; license: string };
  notes?: string;
  createdAt: string;
}

interface Employee {
  id: string;
  fullName: string;
  department: string;
  status: "active" | "inactive";
}
interface Department {
  id: string;
  name: string;
}

export default function ITDashboard() {
  const [records, setRecords] = useState<ITRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [query, setQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  useEffect(() => {
    const its = localStorage.getItem("itAccounts");
    const emps = localStorage.getItem("hrEmployees");
    const depts = localStorage.getItem("departments");
    if (its) setRecords(JSON.parse(its));
    if (emps) setEmployees(JSON.parse(emps));
    if (depts) setDepartments(JSON.parse(depts));
  }, []);

  const stats = useMemo(() => {
    const uniqueEmpIds = new Set(records.map((r) => r.employeeId));
    const activeWithIT = employees.filter(
      (e) => e.status === "active" && uniqueEmpIds.has(e.id),
    ).length;
    return {
      totalRecords: records.length,
      employeesWithIT: uniqueEmpIds.size,
      activeWithIT,
    };
  }, [records, employees]);

  const filtered = records.filter((r) => {
    const matchDept = deptFilter === "all" || r.department === deptFilter;
    const text =
      `${r.employeeName} ${r.systemId} ${r.emails.map((e) => e.email).join(" ")} ${r.vitelGlobal.id || ""} ${r.vitelGlobal.extNumber || ""}`.toLowerCase();
    const matchQuery = !query || text.includes(query.toLowerCase());
    return matchDept && matchQuery;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-deep-900 via-blue-deep-800 to-slate-900">
      <AppNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ServerCog className="h-7 w-7 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">IT Dashboard</h1>
              <p className="text-slate-400">
                Overview of IT accounts and systems
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => (window.location.href = "/it")}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Add Credentials <Plus className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total IT Records</p>
                <p className="text-2xl font-semibold text-white">
                  {stats.totalRecords}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <ServerCog className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Employees with IT</p>
                <p className="text-2xl font-semibold text-white">
                  {stats.employeesWithIT}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active with IT</p>
                <p className="text-2xl font-semibold text-white">
                  {stats.activeWithIT}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </section>

        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">IT Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-slate-700 text-slate-300"
                >
                  {filtered.length}
                </Badge>
                <span className="text-slate-400">results</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, system, email"
                  className="bg-slate-800/50 border-slate-700 text-white w-64"
                />
                <Select value={deptFilter} onValueChange={setDeptFilter}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white w-48">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                  onClick={() => {
                    setQuery("");
                    setDeptFilter("all");
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>System ID</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Emails</TableHead>
                    <TableHead>Vitel ID</TableHead>
                    <TableHead>Vitel Ext</TableHead>
                    <TableHead>Vitel Password</TableHead>
                    <TableHead>LM Player</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">
                        {r.employeeName}
                      </TableCell>
                      <TableCell>{r.department}</TableCell>
                      <TableCell>{r.systemId}</TableCell>
                      <TableCell>{r.tableNumber}</TableCell>
                      <TableCell>
                        {r.emails.map((e) => e.email).join(", ") || "-"}
                      </TableCell>
                      <TableCell>
                        {r.vitelGlobal.id
                          ? `${r.vitelGlobal.type}: ${r.vitelGlobal.id}`
                          : "-"}
                      </TableCell>
                      <TableCell>{r.vitelGlobal.extNumber || "-"}</TableCell>
                      <TableCell>
                        {r.vitelGlobal.password ? "••••••" : "-"}
                      </TableCell>
                      <TableCell>{r.lmPlayer.id || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => (window.location.href = "/it")}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Go to IT Form <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
