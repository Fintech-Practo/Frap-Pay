import { useState, useEffect, useRef } from "react";
import { api } from "@/services/api";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import {
  Send,
  MessageSquare,
  Plus,
} from "lucide-react";
import SkeletonLoader from "@/components/shared/SkeletonLoader";

const SupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const t = await api.getTickets();
      setTickets(t);
      setSelected(t[0] || null);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [selected?.messages]);

  const handleSend = () => {
    if (!message.trim() || !selected) return;

    const newMsg = {
      sender: "You",
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isAgent: false,
    };

    setSelected({
      ...selected,
      messages: [...selected.messages, newMsg],
    });

    setMessage("");
  };

  if (loading)
    return (
      <div className="space-y-4">
        <SkeletonLoader variant="stat" count={3} />
      </div>
    );

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Support
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Get help with your account and transactions.
          </p>
        </div>

        <Button className="gradient-primary text-primary-foreground rounded-xl gap-2">
          <Plus className="h-4 w-4" /> New Ticket
        </Button>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-220px)]">
        {/* Ticket List */}
        <div className="card-modern p-0 overflow-hidden lg:col-span-1">
          <div className="p-4 border-b border-border/50">
            <Input
              placeholder="Search tickets..."
              className="h-9 bg-muted/50 border-0 rounded-lg"
            />
          </div>

          <div
            className="overflow-y-auto divide-y divide-border/30"
            style={{ maxHeight: "calc(100vh - 320px)" }}
          >
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setSelected(ticket)}
                className={cn(
                  "w-full p-4 text-left hover:bg-muted/30 transition-colors",
                  selected?.id === ticket.id &&
                    "bg-muted/50"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground truncate pr-2">
                    {ticket.subject}
                  </span>
                  <StatusBadge status={ticket.status} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {ticket.id}
                  </span>
                  <StatusBadge status={ticket.priority} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat View */}
        <div className="card-modern p-0 overflow-hidden lg:col-span-2 flex flex-col">
          {selected ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    {selected.subject}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selected.id} · Created{" "}
                    {selected.createdAt}
                  </p>
                </div>
                <StatusBadge status={selected.status} />
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-3"
                style={{ maxHeight: "calc(100vh - 420px)" }}
              >
                {selected.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex",
                      msg.isAgent
                        ? "justify-start"
                        : "justify-end"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2.5",
                        msg.isAgent
                          ? "bg-muted rounded-bl-md"
                          : "gradient-primary text-primary-foreground rounded-br-md"
                      )}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p
                        className={cn(
                          "text-[10px] mt-1",
                          msg.isAgent
                            ? "text-muted-foreground"
                            : "text-primary-foreground/60"
                        )}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}

                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSend()
                    }
                    placeholder="Type a message..."
                    className="h-10 bg-muted/50 border-0 rounded-xl flex-1"
                  />

                  <Button
                    onClick={handleSend}
                    size="icon"
                    className="h-10 w-10 rounded-xl gradient-primary text-primary-foreground shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState
              icon={
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              }
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