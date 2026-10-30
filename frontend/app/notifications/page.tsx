"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { prismApi } from "@/lib/api";
import { AppNotification, NotificationType } from "@/types";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  GitMerge, 
  ShieldAlert, 
  CheckCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeTab, setActiveTab] = useState<"ALL" | "ALERTS" | "UPDATES" | "REMINDERS">("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifs() {
      setLoading(true);
      try {
        const data = await prismApi.getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    await prismApi.markAllNotificationsRead();
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = async (id: string) => {
    await prismApi.markNotificationRead(id);
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "ALERTS") return n.type === "OVERDUE" || n.type === "OVERLAP_IDENTIFIED";
    if (activeTab === "UPDATES") return n.type === "STATUS_UPDATED" || n.type === "ACTION_REQUIRED";
    if (activeTab === "REMINDERS") return n.type === "DEADLINE";
    return true;
  });

  const getNotifIcon = (type: NotificationType) => {
    switch (type) {
      case "OVERDUE":
        return { 
          icon: AlertTriangle, 
          style: "text-white bg-[#B0121B]" 
        };
      case "OVERLAP_IDENTIFIED":
        return { 
          icon: GitMerge, 
          style: "text-white bg-coral" 
        };
      case "DEADLINE":
        return { 
          icon: Clock, 
          style: "text-white bg-[#E8A317]" 
        };
      case "STATUS_UPDATED":
        return { 
          icon: CheckCircle2, 
          style: "text-white bg-[#1E8E4E]" 
        };
      case "ACTION_REQUIRED":
        return { 
          icon: ShieldAlert, 
          style: "text-white bg-navy-block" 
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 relative">
      {/* Editorial Header with cropped watermark word */}
      <div className="relative pb-6 overflow-hidden">
        <span className="watermark-word -top-10 -left-6" aria-hidden="true">
          ALERTS
        </span>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-coral" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-ink-muted">
                REAL-TIME DISPATCH · AICTE PRISM
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-ink">
              Notifications &amp; <span className="text-coral italic font-black">Reminders.</span>
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted font-sans leading-relaxed">
              Statutory alerts, AI cross-bureau overlap detections, and SLA escalation warnings.
            </p>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="btn-navy h-10 px-4 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <CheckCheck className="h-3.5 w-3.5 text-coral" />
            <span>Mark all as read</span>
          </button>
        </div>
      </div>

      {/* Text Tabs with 3px Coral Underline */}
      <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
        {(["ALL", "ALERTS", "UPDATES", "REMINDERS"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "py-3.5 px-3 relative transition-colors text-xs font-bold tracking-wider uppercase",
                isActive
                  ? "text-ink"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              <span>{tab.toLowerCase()}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-coral" />
              )}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="editorial-tile overflow-hidden p-0 bg-surface divide-y divide-line">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center text-xs text-ink-muted font-sans">
            No active notifications in this category.
          </div>
        ) : (
          filteredNotifs.map((n) => {
            const cfg = getNotifIcon(n.type);
            const Icon = cfg.icon;

            return (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n.id)}
                className={cn(
                  "p-5 flex items-start gap-4 hover:bg-[#F7F7F7] dark:hover:bg-surface-alt/70 transition-colors cursor-pointer group font-sans",
                  !n.read && "border-l-[3px] border-l-coral bg-coral/5"
                )}
              >
                {/* Type Icon Pill */}
                <div className={cn("p-2.5 shrink-0 flex items-center justify-center", cfg.style)}>
                  <Icon className="h-4 w-4 stroke-[2.5]" />
                </div>

                {/* Message Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-display font-bold text-base text-ink truncate">
                        {n.title}
                      </span>
                      {!n.read && (
                        <span className="h-2 w-2 bg-coral shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-ink-muted shrink-0">
                      {n.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-ink-muted leading-relaxed">
                    {n.message}
                  </p>

                  {n.actionUrl && (
                    <div className="pt-2">
                      <Link
                        href={n.actionUrl}
                        className="btn-tertiary text-xs font-bold"
                      >
                        Take Action on Case ▸
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
