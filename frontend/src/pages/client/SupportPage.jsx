import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { api } from "@/services/api";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Send, MessageSquare, Plus } from "lucide-react";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import { toast } from "@/hooks/use-toast";

const initialTicketForm = {
  subject: "",
  priority: "medium",
  message: "",
};

const SupportPage = () => {
  const location = useLocation();
  const isAdmin = useMemo(() => location.pathname.startsWith("/admin"), [location.pathname]);
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState(initialTicketForm);
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const chatEndRef = useRef(null);

  const load = async () => {
    setLoading(true);
    const data = await api.getTickets();
    setTickets(data);
    setSelected((prev) => data.find((item) => item.id === prev?.id) || data[0] || null);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages]);

  const filteredTickets = tickets.filter((ticket) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return ticket.subject.toLowerCase().includes(query) || ticket.id.toLowerCase().includes(query);
  });

  const handleCreateTicket = async () => {
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) return;
    setCreatingTicket(true);
    const ticket = await api.createTicket({
      subject: ticketForm.subject.trim(),
      priority: ticketForm.priority,
      message: ticketForm.message.trim(),
      createdBy: isAdmin ? "Admin" : "You",
      context: isAdmin ? "admin" : "client",
    });
    await load();
    setSelected(ticket);
    setDialogOpen(false);
    setTicketForm(initialTicketForm);
    setCreatingTicket(false);
    toast({
      title: "Ticket created",
      description: `${ticket.id} has been added successfully.`,
    });
  };

  const handleSend = async () => {
    if (!message.trim() || !selected || sendingReply) return;
    setSendingReply(true);
    const updated = await api.addTicketMessage({
      ticketId: selected.id,
      text: message.trim(),
      sender: isAdmin ? "Admin" : "You",
      isAgent: isAdmin,
    });
    setTickets((prev) => prev.map((ticket) => (ticket.id === updated.id ? updated : ticket)));
    setSelected(updated);
    setMessage("");
    setSendingReply(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonLoader variant="stat" count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Support</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {isAdmin ? "Manage operational issues and respond to support conversations." : "Get help with your account and transactions."}
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground rounded-xl gap-2">
              <Plus className="h-4 w-4" /> New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Subject</label>
                <Input value={ticketForm.subject} onChange={(e) => setTicketForm((prev) => ({ ...prev, subject: e.target.value }))} placeholder="Enter ticket subject" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Priority</label>
                <Select value={ticketForm.priority} onValueChange={(value) => setTicketForm((prev) => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Message</label>
                <Textarea value={ticketForm.message} onChange={(e) => setTicketForm((prev) => ({ ...prev, message: e.target.value }))} placeholder="Describe the issue in detail" className="min-h-[140px]" />
              </div>
              <Button onClick={handleCreateTicket} disabled={creatingTicket || !ticketForm.subject.trim() || !ticketForm.message.trim()} className="w-full rounded-xl gradient-primary text-primary-foreground">
                {creatingTicket ? "Creating..." : "Create Ticket"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-220px)]">
        <div className="card-modern p-0 overflow-hidden lg:col-span-1">
          <div className="p-4 border-b border-border/50">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tickets..." className="h-9 bg-muted/50 border-0 rounded-lg" />
          </div>

          <div className="overflow-y-auto divide-y divide-border/30" style={{ maxHeight: "calc(100vh - 320px)" }}>
            {filteredTickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setSelected(ticket)}
                className={cn("w-full p-4 text-left hover:bg-muted/30 transition-colors", selected?.id === ticket.id && "bg-muted/50")}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground truncate pr-2">{ticket.subject}</span>
                  <StatusBadge status={ticket.status} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{ticket.id}</span>
                  <StatusBadge status={ticket.priority} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card-modern p-0 overflow-hidden lg:col-span-2 flex flex-col">
          {selected ? (
            <>
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{selected.subject}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selected.id} · Created {selected.createdAt}
                  </p>
                </div>
                <StatusBadge status={selected.status} />
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "calc(100vh - 420px)" }}>
                {selected.messages.map((msg, index) => (
                  <div key={`${selected.id}-${index}`} className={cn("flex", msg.isAgent ? "justify-start" : "justify-end")}>
                    <div className={cn("max-w-[75%] rounded-2xl px-4 py-2.5", msg.isAgent ? "bg-muted rounded-bl-md" : "gradient-primary text-primary-foreground rounded-br-md")}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={cn("text-[10px] mt-1", msg.isAgent ? "text-muted-foreground" : "text-primary-foreground/60")}>{msg.time}</p>
                    </div>
                  </div>
                ))}

                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="h-10 bg-muted/50 border-0 rounded-xl flex-1"
                  />

                  <Button onClick={handleSend} disabled={sendingReply || !message.trim()} size="icon" className="h-10 w-10 rounded-xl gradient-primary text-primary-foreground shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState
              icon={<MessageSquare className="h-8 w-8 text-muted-foreground" />}
              title="No ticket selected"
              description="Select a ticket to view the conversation."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
