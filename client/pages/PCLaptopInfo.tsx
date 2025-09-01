import AppNav from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

type Asset = {
  id: string;
  createdAt: string;
  mouseId?: string;
  keyboardId?: string;
  motherboardId?: string;
  cameraId?: string;
  headphoneId?: string;
  powerSupplyId?: string;
  ramId?: string;
};

type SysAsset = { id: string; category: string };

const STORAGE_KEY = "pcLaptopAssets";
const SYS_STORAGE_KEY = "systemAssets";

function nextWxId(list: Asset[]): string {
  let max = 0;
  for (const a of list) {
    const m = a.id.match(/^WX-(\d+)$/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (!Number.isNaN(n)) max = Math.max(max, n);
    }
  }
  const next = String(max + 1).padStart(3, "0");
  return `WX-${next}`;
}

export default function PCLaptopInfo() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Asset[]>([]);
  const [mouseAssets, setMouseAssets] = useState<SysAsset[]>([]);
  const [keyboardAssets, setKeyboardAssets] = useState<SysAsset[]>([]);
  const [motherboardAssets, setMotherboardAssets] = useState<SysAsset[]>([]);
  const [cameraAssets, setCameraAssets] = useState<SysAsset[]>([]);
  const [headphoneAssets, setHeadphoneAssets] = useState<SysAsset[]>([]);
  const [powerSupplyAssets, setPowerSupplyAssets] = useState<SysAsset[]>([]);
  const [ramAssets, setRamAssets] = useState<SysAsset[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    id: "",
    mouseId: "",
    keyboardId: "",
    motherboardId: "",
    cameraId: "",
    headphoneId: "",
    powerSupplyId: "",
    ramId: "",
  });

  // Helper function to get used IDs for a specific component type
  const getUsedIds = (items: Asset[], field: keyof Asset): string[] => {
    return items
      .map(item => item[field])
      .filter((id): id is string => !!id);
  };

  // Helper function to filter available assets (not used)
  const getAvailableAssets = (allAssets: SysAsset[], usedIds: string[]): SysAsset[] => {
    return allAssets.filter(asset => !usedIds.includes(asset.id));
  };

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const currentItems = raw ? JSON.parse(raw) : [];
    setItems(currentItems);

    const sysRaw = localStorage.getItem(SYS_STORAGE_KEY);
    const sysList: SysAsset[] = sysRaw ? JSON.parse(sysRaw) : [];

    // Get all used IDs for each component type
    const usedMouseIds = getUsedIds(currentItems, 'mouseId');
    const usedKeyboardIds = getUsedIds(currentItems, 'keyboardId');
    const usedMotherboardIds = getUsedIds(currentItems, 'motherboardId');
    const usedCameraIds = getUsedIds(currentItems, 'cameraId');
    const usedHeadphoneIds = getUsedIds(currentItems, 'headphoneId');
    const usedPowerSupplyIds = getUsedIds(currentItems, 'powerSupplyId');
    const usedRamIds = getUsedIds(currentItems, 'ramId');

    // Filter out used IDs from available assets
    const allMouseAssets = sysList.filter((s) => s.category === "mouse");
    const allKeyboardAssets = sysList.filter((s) => s.category === "keyboard");
    const allMotherboardAssets = sysList.filter((s) => s.category === "motherboard");
    const allCameraAssets = sysList.filter((s) => s.category === "camera");
    const allHeadphoneAssets = sysList.filter((s) => s.category === "headphone");
    const allPowerSupplyAssets = sysList.filter((s) => s.category === "power-supply");
    const allRamAssets = sysList.filter((s) => s.category === "ram");

    setMouseAssets(getAvailableAssets(allMouseAssets, usedMouseIds));
    setKeyboardAssets(getAvailableAssets(allKeyboardAssets, usedKeyboardIds));
    setMotherboardAssets(getAvailableAssets(allMotherboardAssets, usedMotherboardIds));
    setCameraAssets(getAvailableAssets(allCameraAssets, usedCameraIds));
    setHeadphoneAssets(getAvailableAssets(allHeadphoneAssets, usedHeadphoneIds));
    setPowerSupplyAssets(getAvailableAssets(allPowerSupplyAssets, usedPowerSupplyIds));
    setRamAssets(getAvailableAssets(allRamAssets, usedRamIds));
  }, []);

  const openForm = () => {
    // Refresh available assets before opening form
    const raw = localStorage.getItem(STORAGE_KEY);
    const currentItems = raw ? JSON.parse(raw) : [];

    const sysRaw = localStorage.getItem(SYS_STORAGE_KEY);
    const sysList: SysAsset[] = sysRaw ? JSON.parse(sysRaw) : [];

    // Get all used IDs for each component type
    const usedMouseIds = getUsedIds(currentItems, 'mouseId');
    const usedKeyboardIds = getUsedIds(currentItems, 'keyboardId');
    const usedMotherboardIds = getUsedIds(currentItems, 'motherboardId');
    const usedCameraIds = getUsedIds(currentItems, 'cameraId');
    const usedHeadphoneIds = getUsedIds(currentItems, 'headphoneId');
    const usedPowerSupplyIds = getUsedIds(currentItems, 'powerSupplyId');
    const usedRamIds = getUsedIds(currentItems, 'ramId');

    // Get fresh available assets
    const freshMouseAssets = getAvailableAssets(sysList.filter((s) => s.category === "mouse"), usedMouseIds);
    const freshKeyboardAssets = getAvailableAssets(sysList.filter((s) => s.category === "keyboard"), usedKeyboardIds);
    const freshMotherboardAssets = getAvailableAssets(sysList.filter((s) => s.category === "motherboard"), usedMotherboardIds);
    const freshCameraAssets = getAvailableAssets(sysList.filter((s) => s.category === "camera"), usedCameraIds);
    const freshHeadphoneAssets = getAvailableAssets(sysList.filter((s) => s.category === "headphone"), usedHeadphoneIds);
    const freshPowerSupplyAssets = getAvailableAssets(sysList.filter((s) => s.category === "power-supply"), usedPowerSupplyIds);
    const freshRamAssets = getAvailableAssets(sysList.filter((s) => s.category === "ram"), usedRamIds);

    // Update state with fresh data
    setMouseAssets(freshMouseAssets);
    setKeyboardAssets(freshKeyboardAssets);
    setMotherboardAssets(freshMotherboardAssets);
    setCameraAssets(freshCameraAssets);
    setHeadphoneAssets(freshHeadphoneAssets);
    setPowerSupplyAssets(freshPowerSupplyAssets);
    setRamAssets(freshRamAssets);

    const id = nextWxId(currentItems);
    const firstMouse = freshMouseAssets[0]?.id || "";
    const firstKeyboard = freshKeyboardAssets[0]?.id || "";
    const firstMotherboard = freshMotherboardAssets[0]?.id || "";
    const firstCamera = freshCameraAssets[0]?.id || "";
    const firstHeadphone = freshHeadphoneAssets[0]?.id || "";
    const firstPower = freshPowerSupplyAssets[0]?.id || "";
    const firstRam = freshRamAssets[0]?.id || "";

    setForm({
      id,
      mouseId: firstMouse,
      keyboardId: firstKeyboard,
      motherboardId: firstMotherboard,
      cameraId: firstCamera,
      headphoneId: firstHeadphone,
      powerSupplyId: firstPower,
      ramId: firstRam,
    });
    setShowForm(true);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const record: Asset = {
      id: form.id || nextWxId(items),
      createdAt: new Date().toISOString(),
      mouseId: form.mouseId || undefined,
      keyboardId: form.keyboardId || undefined,
      motherboardId: form.motherboardId || undefined,
      cameraId: form.cameraId || undefined,
      headphoneId: form.headphoneId || undefined,
      powerSupplyId: form.powerSupplyId || undefined,
      ramId: form.ramId || undefined,
    };
    const next = [record, ...items];
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setShowForm(false);
    alert("Saved");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-deep-900 via-blue-deep-800 to-slate-900">
      <AppNav />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">PC/Laptop Info</h1>
            <p className="text-slate-400">Manage PCs and laptops</p>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              onClick={openForm}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Add
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="bg-slate-700 hover:bg-slate-600 text-white"
            >
              Home
            </Button>
          </div>
        </header>

        {showForm && (
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Add PC/Laptop</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={save}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="space-y-2">
                  <Label className="text-slate-300">ID</Label>
                  <Input
                    value={form.id}
                    readOnly
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Mouse (IDs)</Label>
                  <Select
                    value={form.mouseId}
                    onValueChange={(v) =>
                      setForm((s) => ({ ...s, mouseId: v }))
                    }
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue
                        placeholder={
                          mouseAssets.length ? "Select mouse" : "No mouse items"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-64">
                      {mouseAssets.length === 0 ? (
                        <div className="px-3 py-2 text-slate-400">
                          No mouse items
                        </div>
                      ) : (
                        mouseAssets.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.id}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Keyboard (IDs)</Label>
                  <Select
                    value={form.keyboardId}
                    onValueChange={(v) =>
                      setForm((s) => ({ ...s, keyboardId: v }))
                    }
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue
                        placeholder={
                          keyboardAssets.length
                            ? "Select keyboard"
                            : "No keyboard items"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-64">
                      {keyboardAssets.length === 0 ? (
                        <div className="px-3 py-2 text-slate-400">
                          No keyboard items
                        </div>
                      ) : (
                        keyboardAssets.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.id}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Motherboard (IDs)</Label>
                  <Select
                    value={form.motherboardId}
                    onValueChange={(v) =>
                      setForm((s) => ({ ...s, motherboardId: v }))
                    }
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue
                        placeholder={
                          motherboardAssets.length
                            ? "Select motherboard"
                            : "No motherboard items"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-64">
                      {motherboardAssets.length === 0 ? (
                        <div className="px-3 py-2 text-slate-400">
                          No motherboard items
                        </div>
                      ) : (
                        motherboardAssets.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.id}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Camera (IDs)</Label>
                  <Select
                    value={form.cameraId}
                    onValueChange={(v) =>
                      setForm((s) => ({ ...s, cameraId: v }))
                    }
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue
                        placeholder={
                          cameraAssets.length
                            ? "Select camera"
                            : "No camera items"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-64">
                      {cameraAssets.length === 0 ? (
                        <div className="px-3 py-2 text-slate-400">
                          No camera items
                        </div>
                      ) : (
                        cameraAssets.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.id}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Headphone (IDs)</Label>
                  <Select
                    value={form.headphoneId}
                    onValueChange={(v) =>
                      setForm((s) => ({ ...s, headphoneId: v }))
                    }
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue
                        placeholder={
                          headphoneAssets.length
                            ? "Select headphone"
                            : "No headphone items"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-64">
                      {headphoneAssets.length === 0 ? (
                        <div className="px-3 py-2 text-slate-400">
                          No headphone items
                        </div>
                      ) : (
                        headphoneAssets.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.id}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Power Supply (IDs)</Label>
                  <Select
                    value={form.powerSupplyId}
                    onValueChange={(v) =>
                      setForm((s) => ({ ...s, powerSupplyId: v }))
                    }
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue
                        placeholder={
                          powerSupplyAssets.length
                            ? "Select power supply"
                            : "No power supply items"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-64">
                      {powerSupplyAssets.length === 0 ? (
                        <div className="px-3 py-2 text-slate-400">
                          No power supply items
                        </div>
                      ) : (
                        powerSupplyAssets.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.id}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">RAM (IDs)</Label>
                  <Select
                    value={form.ramId}
                    onValueChange={(v) => setForm((s) => ({ ...s, ramId: v }))}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue
                        placeholder={
                          ramAssets.length ? "Select RAM" : "No RAM items"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-64">
                      {ramAssets.length === 0 ? (
                        <div className="px-3 py-2 text-slate-400">
                          No RAM items
                        </div>
                      ) : (
                        ramAssets.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.id}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-600 text-slate-300"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Saved Items</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-slate-300">No records</p>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Mouse ID</TableHead>
                      <TableHead>Keyboard ID</TableHead>
                      <TableHead>Motherboard ID</TableHead>
                      <TableHead>Camera ID</TableHead>
                      <TableHead>Headphone ID</TableHead>
                      <TableHead>Power Supply ID</TableHead>
                      <TableHead>RAM ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.id}</TableCell>
                        <TableCell>{a.mouseId || "-"}</TableCell>
                        <TableCell>{a.keyboardId || "-"}</TableCell>
                        <TableCell>{a.motherboardId || "-"}</TableCell>
                        <TableCell>{a.cameraId || "-"}</TableCell>
                        <TableCell>{a.headphoneId || "-"}</TableCell>
                        <TableCell>{a.powerSupplyId || "-"}</TableCell>
                        <TableCell>{a.ramId || "-"}</TableCell>
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
