import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, CheckCircle2, Timer } from "lucide-react";

interface ElectionCountdownProps {
  startDate: Date;
  endDate: Date;
  title: string;
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function ElectionCountdown({
  startDate,
  endDate,
  title,
  compact = false,
}: ElectionCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [status, setStatus] = useState<"upcoming" | "ongoing" | "ended">("upcoming");

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (now < start) {
        setStatus("upcoming");
        const diff = start.getTime() - now.getTime();
        setTimeLeft(parseTime(diff));
      } else if (now >= start && now <= end) {
        setStatus("ongoing");
        const diff = end.getTime() - now.getTime();
        setTimeLeft(parseTime(diff));
      } else {
        setStatus("ended");
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const parseTime = (diff: number): TimeLeft => {
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startDate, endDate]);

  const statusConfig = {
    upcoming: {
      label: "Starts In",
      badge: "Upcoming",
      badgeClass: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
      icon: Calendar,
      gradient: "from-yellow-500/20 to-orange-500/20",
    },
    ongoing: {
      label: "Ends In",
      badge: "Live Now",
      badgeClass: "bg-green-500/20 text-green-600 border-green-500/30 animate-pulse",
      icon: Timer,
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    ended: {
      label: "Election Ended",
      badge: "Completed",
      badgeClass: "bg-gray-500/20 text-gray-600 border-gray-500/30",
      icon: CheckCircle2,
      gradient: "from-gray-500/20 to-slate-500/20",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r ${config.gradient}`}>
        <Icon className="w-4 h-4" />
        <Badge variant="outline" className={config.badgeClass}>
          {config.badge}
        </Badge>
        {status !== "ended" && (
          <span className="text-sm font-mono font-semibold">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
          </span>
        )}
      </div>
    );
  }

  return (
    <Card className={`glass-card overflow-hidden border-primary/10`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-50`} />
      <CardContent className="relative p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">{config.label}</span>
          </div>
          <Badge variant="outline" className={config.badgeClass}>
            {config.badge}
          </Badge>
        </div>

        <h3 className="font-semibold mb-4 line-clamp-1">{title}</h3>

        {status !== "ended" ? (
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Mins", value: timeLeft.minutes },
              { label: "Secs", value: timeLeft.seconds },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-2 border border-primary/10">
                  <span className="text-2xl font-bold font-mono bg-gradient-to-br from-[#FF9933] to-[#138808] bg-clip-text text-transparent">
                    {String(item.value).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground mt-1 block">{item.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <CheckCircle2 className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Voting has concluded</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
