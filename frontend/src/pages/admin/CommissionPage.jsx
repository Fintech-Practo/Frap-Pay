import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Edit3, Save } from "lucide-react";

const schemes = [
  {
    id: "upi",
    name: "UPI Collection",
    slabs: [
      { id: "1", range: "₹0 - ₹5,000", rate: "0.30%", type: "Percentage" },
      { id: "2", range: "₹5,001 - ₹25,000", rate: "0.25%", type: "Percentage" },
      { id: "3", range: "₹25,001+", rate: "0.20%", type: "Percentage" },
    ],
  },
  {
    id: "imps",
    name: "IMPS Payout",
    slabs: [
      { id: "4", range: "₹0 - ₹10,000", rate: "₹5", type: "Flat" },
      { id: "5", range: "₹10,001 - ₹50,000", rate: "₹8", type: "Flat" },
      { id: "6", range: "₹50,001+", rate: "₹12", type: "Flat" },
    ],
  },
  {
    id: "neft",
    name: "NEFT Payout",
    slabs: [
      { id: "7", range: "₹0 - ₹1,00,000", rate: "₹10", type: "Flat" },
      { id: "8", range: "₹1,00,001+", rate: "₹15", type: "Flat" },
    ],
  },
];

const CommissionPage = () => {
  const [editingSlab, setEditingSlab] = useState(null);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Commission Schemes
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Configure commission rates and slabs.
        </p>
      </div>

      <Tabs defaultValue="upi" className="space-y-4">
        <TabsList className="bg-muted/50 rounded-xl p-1 h-auto">
          {schemes.map((s) => (
            <TabsTrigger
              key={s.id}
              value={s.id}
              className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm px-4 py-2 text-sm"
            >
              {s.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {schemes.map((scheme) => (
          <TabsContent
            key={scheme.id}
            value={scheme.id}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {scheme.slabs.map((slab, i) => (
                <div
                  key={slab.id}
                  className="card-modern opacity-0 animate-in-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Slab {i + 1}
                    </span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        setEditingSlab(
                          editingSlab === slab.id
                            ? null
                            : slab.id
                        )
                      }
                    >
                      {editingSlab === slab.id ? (
                        <Save className="h-3.5 w-3.5" />
                      ) : (
                        <Edit3 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>

                  <p className="text-sm font-medium text-foreground mb-2">
                    {slab.range}
                  </p>

                  <div className="flex items-center justify-between">
                    {editingSlab === slab.id ? (
                      <Input
                        defaultValue={slab.rate}
                        className="h-8 w-24 rounded-lg text-sm"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-foreground">
                        {slab.rate}
                      </span>
                    )}

                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {slab.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CommissionPage;