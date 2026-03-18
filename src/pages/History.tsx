import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileDown, Trash2, Clock, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { generateCommercialPdf } from "@/utils/generatePdf";
import type { CompanyInfo } from "@/utils/generatePdf";

export interface HistoryEntry {
  id: string;
  date: string;
  companyName: string;
  contactPerson: string;
  totalPrice: number;
  selectedProductNames: string[];
  pdfData: any;
}

const HISTORY_KEY = "pipe_calc_history";

export function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveToHistory(entry: HistoryEntry) {
  const history = loadHistory();
  history.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat("ru-RU").format(n) + " ₽";

const History = () => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => { setEntries(loadHistory()); }, []);

  const handleDownload = async (entry: HistoryEntry) => {
    setLoading(entry.id);
    try {
      await generateCommercialPdf(entry.pdfData);
      toast({ title: "PDF скачан" });
    } catch {
      toast({ title: "Ошибка генерации PDF", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    toast({ title: "Запись удалена" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-header">
        <div className="container max-w-5xl py-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors bg-white/10 rounded-full px-4 py-2">
              <ArrowLeft className="w-4 h-4" /> Калькулятор
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground">ИСТОРИЯ</h1>
          </div>
        </div>
      </div>
      <div className="container max-w-5xl py-8 space-y-4">
        {entries.length === 0 ? (
          <div className="card-soft p-12 text-center space-y-3">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-lg font-semibold text-muted-foreground">История пуста</p>
          </div>
        ) : entries.map((entry) => (
          <div key={entry.id} className="card-soft p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" /> {entry.date}
                </div>
                {entry.companyName && (
                  <div className="flex items-center gap-2 text-foreground font-bold">
                    <Building2 className="w-4 h-4 text-primary" /> {entry.companyName}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {entry.selectedProductNames.map((name) => (
                    <span key={name} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{name}</span>
                  ))}
                </div>
                <p className="text-lg font-extrabold text-primary">{formatPrice(entry.totalPrice)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button size="sm" onClick={() => handleDownload(entry)} disabled={loading === entry.id}
                  className="gradient-accent text-accent-foreground rounded-full font-bold">
                  <FileDown className="w-4 h-4 mr-1" /> {loading === entry.id ? "..." : "PDF"}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(entry.id)}
                  className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
