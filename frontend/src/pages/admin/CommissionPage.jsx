import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit3, Plus, Save, Users } from "lucide-react";

const initialScheme = { name: "", category: "payin", description: "" };
const initialSlab = { min: "", max: "", rate: "", rateType: "percentage" };

const CommissionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState(location.pathname.includes("/slabs") ? "slabs" : "schemes");
  const [schemes, setSchemes] = useState([]);
  const [newScheme, setNewScheme] = useState(initialScheme);
  const [newSlab, setNewSlab] = useState(initialSlab);
  const [editingScheme, setEditingScheme] = useState(null);
  const [editingSlab, setEditingSlab] = useState(null);
  const [selectedSchemeId, setSelectedSchemeId] = useState("");

  const load = async () => {
    const data = await api.getCommissionData();
    setSchemes(data);
    setSelectedSchemeId((prev) => (data.some((item) => item.id === prev) ? prev : data[0]?.id || ""));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setTab(location.pathname.includes("/slabs") ? "slabs" : "schemes");
  }, [location.pathname]);

  const currentSchemeId = useMemo(() => selectedSchemeId || schemes[0]?.id || "", [selectedSchemeId, schemes]);
  const selectedScheme = useMemo(() => schemes.find((scheme) => scheme.id === currentSchemeId) || null, [schemes, currentSchemeId]);

  const updateSchemeField = (schemeId, key, value) => {
    setSchemes((prev) => prev.map((scheme) => (scheme.id === schemeId ? { ...scheme, [key]: value } : scheme)));
  };

  const updateSlabField = (schemeId, slabId, key, value) => {
    setSchemes((prev) =>
      prev.map((scheme) =>
        scheme.id === schemeId
          ? {
              ...scheme,
              slabs: scheme.slabs.map((slab) => (slab.id === slabId ? { ...slab, [key]: value } : slab)),
            }
          : scheme
      )
    );
  };

  const createScheme = async () => {
    await api.createCommissionScheme(newScheme);
    setNewScheme(initialScheme);
    await load();
  };

  const saveScheme = async (scheme) => {
    await api.updateCommissionScheme(scheme.id, {
      name: scheme.name,
      category: scheme.category,
      description: scheme.description,
    });
    setEditingScheme(null);
    await load();
  };

  const createSlab = async () => {
    if (!currentSchemeId) return;
    await api.createCommissionSlab(currentSchemeId, newSlab);
    setNewSlab(initialSlab);
    await load();
  };

  const saveSlab = async (schemeId, slab) => {
    await api.updateCommissionSlab(schemeId, slab.id, slab);
    setEditingSlab(null);
    await load();
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Commission Control</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Create schemes, link slabs to the correct scheme, and then assign that scheme to members from the member details page.
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(value) => {
          setTab(value);
          navigate(`/admin/commission/${value}`);
        }}
        className="space-y-4"
      >
        <TabsList className="bg-muted/50 rounded-xl p-1 h-auto">
          <TabsTrigger value="schemes" className="rounded-lg px-4 py-2 text-sm">
            Schemes
          </TabsTrigger>
          <TabsTrigger value="slabs" className="rounded-lg px-4 py-2 text-sm">
            Slabs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schemes" className="space-y-4">
          <div className="card-modern">
            <div className="grid gap-4 md:grid-cols-3">
              <Input value={newScheme.name} onChange={(e) => setNewScheme((prev) => ({ ...prev, name: e.target.value }))} placeholder="New scheme name" />
              <Select value={newScheme.category} onValueChange={(value) => setNewScheme((prev) => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payin">Payin</SelectItem>
                  <SelectItem value="payout">Payout</SelectItem>
                  <SelectItem value="aeps">AEPS</SelectItem>
                </SelectContent>
              </Select>
              <Input value={newScheme.description} onChange={(e) => setNewScheme((prev) => ({ ...prev, description: e.target.value }))} placeholder="Description" />
            </div>
            <Button className="mt-4 rounded-xl" onClick={createScheme}>
              <Plus className="mr-2 h-4 w-4" />
              Create Scheme
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {schemes.map((scheme) => (
              <div key={scheme.id} className="card-modern">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-3 flex-1">
                    {editingScheme === scheme.id ? (
                      <>
                        <Input value={scheme.name} onChange={(e) => updateSchemeField(scheme.id, "name", e.target.value)} />
                        <Select value={scheme.category} onValueChange={(value) => updateSchemeField(scheme.id, "category", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="payin">Payin</SelectItem>
                            <SelectItem value="payout">Payout</SelectItem>
                            <SelectItem value="aeps">AEPS</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input value={scheme.description || ""} onChange={(e) => updateSchemeField(scheme.id, "description", e.target.value)} />
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-foreground">{scheme.name}</h3>
                        <p className="text-sm text-muted-foreground">{scheme.description}</p>
                      </>
                    )}

                    <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {scheme.category} • {scheme.appliedMembers.length} members
                    </div>

                    <div className="rounded-2xl border border-border/60 bg-muted/25 p-3">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Linked Slabs</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {scheme.slabs.length ? (
                          scheme.slabs.map((slab) => (
                            <span key={slab.id} className="inline-flex rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-foreground">
                              {slab.range} • {slab.displayRate}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No slabs linked yet.</span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        Applied Members
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {scheme.appliedMembers.length ? (
                          scheme.appliedMembers.map((memberId) => (
                            <span key={memberId} className="inline-flex rounded-full bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                              {memberId}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No members assigned yet.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => (editingScheme === scheme.id ? saveScheme(scheme) : setEditingScheme(scheme.id))}
                  >
                    {editingScheme === scheme.id ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="slabs" className="space-y-4">
          <div className="card-modern">
            <div className="grid gap-4 md:grid-cols-4">
              <Select value={currentSchemeId} onValueChange={setSelectedSchemeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose scheme" />
                </SelectTrigger>
                <SelectContent>
                  {schemes.map((scheme) => (
                    <SelectItem key={scheme.id} value={scheme.id}>
                      {scheme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input value={newSlab.min} onChange={(e) => setNewSlab((prev) => ({ ...prev, min: e.target.value }))} placeholder="Min amount" />
              <Input value={newSlab.max} onChange={(e) => setNewSlab((prev) => ({ ...prev, max: e.target.value }))} placeholder="Max amount" />
              <Input value={newSlab.rate} onChange={(e) => setNewSlab((prev) => ({ ...prev, rate: e.target.value }))} placeholder="Rate" />
            </div>

            <div className="mt-4 flex items-center gap-4">
              <Select value={newSlab.rateType} onValueChange={(value) => setNewSlab((prev) => ({ ...prev, rateType: value }))}>
                <SelectTrigger className="w-52">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="flat">Flat</SelectItem>
                </SelectContent>
              </Select>
              <Button className="rounded-xl" onClick={createSlab}>
                <Plus className="mr-2 h-4 w-4" />
                Add Slab
              </Button>
            </div>

            {selectedScheme && (
              <div className="mt-4 rounded-2xl border border-primary/15 bg-primary/5 p-4">
                <div className="text-sm font-semibold text-foreground">{selectedScheme.name}</div>
                <div className="mt-1 text-sm text-muted-foreground">{selectedScheme.description || "No scheme description added yet."}</div>
                <div className="mt-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {selectedScheme.category} • {selectedScheme.appliedMembers.length} members • {selectedScheme.slabs.length} slabs
                </div>
              </div>
            )}
          </div>

          {schemes.map((scheme) => (
            <div key={scheme.id} className="space-y-3">
              <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-muted/15 px-4 py-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{scheme.name}</h3>
                  <p className="text-sm text-muted-foreground">{scheme.description || "No description added."}</p>
                </div>
                <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {scheme.category} • {scheme.appliedMembers.length} members • {scheme.slabs.length} slabs
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {scheme.slabs.map((slab) => (
                  <div key={slab.id} className="card-modern">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{slab.range}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => (editingSlab === slab.id ? saveSlab(scheme.id, slab) : setEditingSlab(slab.id))}
                      >
                        {editingSlab === slab.id ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                      </Button>
                    </div>

                    {editingSlab === slab.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <Input type="number" value={slab.min} onChange={(e) => updateSlabField(scheme.id, slab.id, "min", e.target.value)} />
                          <Input type="number" value={slab.max ?? ""} onChange={(e) => updateSlabField(scheme.id, slab.id, "max", e.target.value)} placeholder="blank = no max" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input type="number" value={slab.rate} onChange={(e) => updateSlabField(scheme.id, slab.id, "rate", e.target.value)} />
                          <Select value={slab.rateType} onValueChange={(value) => updateSlabField(scheme.id, slab.id, "rateType", value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">Percentage</SelectItem>
                              <SelectItem value="flat">Flat</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-foreground">{slab.displayRate}</div>
                        <div className="mt-2 text-sm text-muted-foreground">{slab.rateType}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommissionPage;
