import AppNav from "@/components/Navigation";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Save, Shield, ServerCog, RefreshCw } from "lucide-react";

interface Employee {
  id: string;
  fullName: string;
  department: string;
  tableNumber: string;
  email: string;
  status: "active" | "inactive";
}

interface Department {
  id: string;
  name: string;
}

type EmailCred = { email: string; password: string };

interface ITRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  systemId: string;
  tableNumber: string;
  department: string;
  emails: EmailCred[];
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

export default function ITPage() {
  const [userRole, setUserRole] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [records, setRecords] = useState<ITRecord[]>([]);

  // Load local data
  useEffect(() => {
    setUserRole(localStorage.getItem("userRole") || "");
    const emps = localStorage.getItem("hrEmployees");
    const depts = localStorage.getItem("departments");
    const its = localStorage.getItem("itAccounts");
    if (emps) setEmployees(JSON.parse(emps));
    if (depts) setDepartments(JSON.parse(depts));
    if (its) setRecords(JSON.parse(its));

    // Load available PC/Laptop IDs
    loadAvailableSystemIds();
  }, []);

  // Load and filter available PC/Laptop IDs
  const loadAvailableSystemIds = () => {
    const pcLaptopData = localStorage.getItem("pcLaptopAssets");
    const itRecords = localStorage.getItem("itAccounts");

    if (pcLaptopData) {
      const pcLaptops = JSON.parse(pcLaptopData);
      const pcLaptopIds = pcLaptops.map((item: any) => item.id);

      // Get currently assigned system IDs
      const assignedIds = itRecords
        ? JSON.parse(itRecords).map((record: ITRecord) => record.systemId)
        : [];

      // Filter out assigned IDs to show only available ones
      const available = pcLaptopIds.filter((id: string) => !assignedIds.includes(id));
      setAvailableSystemIds(available);
    }
  };

  const saveRecords = (next: ITRecord[]) => {
    setRecords(next);
    localStorage.setItem("itAccounts", JSON.stringify(next));

    // Refresh available system IDs after saving
    loadAvailableSystemIds();
  };

  // Form state
  const [employeeId, setEmployeeId] = useState<string>("");
  const employee = useMemo(
    () => employees.find((e) => e.id === employeeId),
    [employees, employeeId],
  );
  const [systemId, setSystemId] = useState("");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [emails, setEmails] = useState<EmailCred[]>([
    { email: "", password: "" },
  ]);
  const [vitel, setVitel] = useState({
    id: "",
    password: "",
    type: "extension",
    extNumber: "",
  });
  const [lm, setLm] = useState({ id: "", password: "", license: "standard" });
  const [notes, setNotes] = useState("");
  const [availableSystemIds, setAvailableSystemIds] = useState<string[]>([]);

  useEffect(() => {
    if (employee) {
      setDepartment(employee.department || department);
      setTableNumber(employee.tableNumber || tableNumber);
    }
  }, [employee]);

  const availableTables = useMemo(
    () => Array.from({ length: 32 }, (_, i) => String(i + 1)),
    [],
  );

  const addEmailRow = () =>
    setEmails((rows) => [...rows, { email: "", password: "" }]);
  const removeEmailRow = (idx: number) =>
    setEmails((rows) => rows.filter((_, i) => i !== idx));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !systemId || !department || !tableNumber) {
      alert(
        "Please fill required fields (Employee, System ID, Department, Table)",
      );
      return;
    }
    const cleanEmails = emails.filter((r) => r.email.trim());
    const rec: ITRecord = {
      id: `${Date.now()}`,
      employeeId,
      employeeName: employee?.fullName || "",
      systemId: systemId.trim(),
      tableNumber,
      department,
      emails: cleanEmails,
      vitelGlobal: { ...vitel },
      lmPlayer: { ...lm },
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    saveRecords([rec, ...records]);
    // reset minimal
    setSystemId("");
    setEmails([{ email: "", password: "" }]);
    setVitel({ id: "", password: "", type: "extension", extNumber: "" });
    setLm({ id: "", password: "", license: "standard" });
    setNotes("");
    alert("Saved");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-deep-900 via-blue-deep-800 to-slate-900">
      <AppNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <ServerCog className="h-7 w-7 text-blue-400" /> IT Management
            </h1>
            <p className="text-slate-400">
              Create and store system credentials
            </p>
          </div>
          <Badge variant="secondary" className="bg-slate-700 text-slate-300">
            Role: {userRole || "guest"}
          </Badge>
        </header>

        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Add IT Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={submit}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="space-y-2">
                <Label className="text-slate-300">Employee Name</Label>
                <Select value={employeeId} onValueChange={setEmployeeId}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-64">
                    {employees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label className="text-slate-300">System ID</Label>
                    <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                      {availableSystemIds.length} available
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    onClick={loadAvailableSystemIds}
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    title="Refresh available IDs"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
                <Select value={systemId} onValueChange={setSystemId}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder={
                      availableSystemIds.length
                        ? "Select available PC/Laptop ID"
                        : "No PC/Laptop IDs available"
                    } />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-64">
                    {availableSystemIds.length === 0 ? (
                      <div className="px-3 py-2 text-slate-400">
                        No available PC/Laptop IDs. Create some in PC/Laptop Info first.
                      </div>
                    ) : (
                      availableSystemIds.map((id) => (
                        <SelectItem key={id} value={id}>
                          {id}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-64">
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Table Number</Label>
                <Select value={tableNumber} onValueChange={setTableNumber}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="Select table (1-32)" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-64">
                    {availableTables.map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Emails */}
              <div className="md:col-span-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Emails and Passwords</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300"
                    onClick={addEmailRow}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Email
                  </Button>
                </div>
                <div className="space-y-2">
                  {emails.map((row, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center"
                    >
                      <Input
                        placeholder="email@example.com"
                        value={row.email}
                        onChange={(e) => {
                          const v = e.target.value;
                          setEmails((r) =>
                            r.map((x, i) =>
                              i === idx ? { ...x, email: v } : x,
                            ),
                          );
                        }}
                        className="bg-slate-800/50 border-slate-700 text-white"
                      />
                      <Input
                        placeholder="password"
                        value={row.password}
                        onChange={(e) => {
                          const v = e.target.value;
                          setEmails((r) =>
                            r.map((x, i) =>
                              i === idx ? { ...x, password: v } : x,
                            ),
                          );
                        }}
                        className="bg-slate-800/50 border-slate-700 text-white"
                        type="password"
                      />
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-red-600 text-red-400"
                          onClick={() => removeEmailRow(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vitel Global */}
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Vitel Global Type</Label>
                  <Select
                    value={vitel.type}
                    onValueChange={(v) => setVitel((s) => ({ ...s, type: v }))}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="extension">Extension</SelectItem>
                      <SelectItem value="softphone">Softphone</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">
                    Vitel Extension Number
                  </Label>
                  <Input
                    value={vitel.extNumber}
                    onChange={(e) =>
                      setVitel((s) => ({ ...s, extNumber: e.target.value }))
                    }
                    className="bg-slate-800/50 border-slate-700 text-white"
                    placeholder="e.g. 101"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Vitel Global ID</Label>
                  <Input
                    value={vitel.id}
                    onChange={(e) =>
                      setVitel((s) => ({ ...s, id: e.target.value }))
                    }
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">
                    Vitel Global Password
                  </Label>
                  <Input
                    type="password"
                    value={vitel.password}
                    onChange={(e) =>
                      setVitel((s) => ({ ...s, password: e.target.value }))
                    }
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
              </div>

              {/* LM Player */}
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">LM Player License</Label>
                  <Select
                    value={lm.license}
                    onValueChange={(v) => setLm((s) => ({ ...s, license: v }))}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">LM Player ID</Label>
                  <Input
                    value={lm.id}
                    onChange={(e) =>
                      setLm((s) => ({ ...s, id: e.target.value }))
                    }
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">LM Player Password</Label>
                  <Input
                    type="password"
                    value={lm.password}
                    onChange={(e) =>
                      setLm((s) => ({ ...s, password: e.target.value }))
                    }
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="md:col-span-3 space-y-2">
                <Label className="text-slate-300">Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  placeholder="Optional notes"
                />
              </div>

              <div className="md:col-span-3 flex justify-end gap-2">
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Save className="h-4 w-4 mr-2" /> Save
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Saved IT Records</CardTitle>
          </CardHeader>
          <CardContent>
            {records.length === 0 ? (
              <p className="text-slate-400">No IT records yet</p>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>System ID</TableHead>
                      <TableHead>Dept</TableHead>
                      <TableHead>Table</TableHead>
                      <TableHead>Emails</TableHead>
                      <TableHead>Vitel</TableHead>
                      <TableHead>LM Player</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">
                          {r.employeeName}
                        </TableCell>
                        <TableCell>{r.systemId}</TableCell>
                        <TableCell>{r.department}</TableCell>
                        <TableCell>{r.tableNumber}</TableCell>
                        <TableCell>
                          {r.emails.map((e) => e.email).join(", ")}
                        </TableCell>
                        <TableCell>
                          {r.vitelGlobal.id
                            ? `${r.vitelGlobal.type}: ${r.vitelGlobal.id}${r.vitelGlobal.extNumber ? ` (${r.vitelGlobal.extNumber})` : ""}`
                            : "-"}
                        </TableCell>
                        <TableCell>{r.lmPlayer.id || "-"}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-600 text-red-400"
                            onClick={() => {
                              saveRecords(records.filter((x) => x.id !== r.id));
                              // Refresh available IDs after deletion
                              setTimeout(loadAvailableSystemIds, 100);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
