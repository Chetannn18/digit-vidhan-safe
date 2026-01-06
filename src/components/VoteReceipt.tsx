import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, CheckCircle } from "lucide-react";

interface VoteReceiptProps {
  electionTitle: string;
  candidateName: string;
  partyName: string;
  votedAt: Date;
  confirmationId: string;
  voterName: string;
}

export default function VoteReceipt({
  electionTitle,
  candidateName,
  partyName,
  votedAt,
  confirmationId,
  voterName,
}: VoteReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Vote Receipt - ${confirmationId}</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; padding: 40px; background: #f5f5f5; }
            .receipt { background: white; padding: 40px; border-radius: 12px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { text-align: center; border-bottom: 2px dashed #e5e5e5; padding-bottom: 20px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #FF9933; margin-bottom: 8px; }
            .subtitle { color: #666; font-size: 14px; }
            .icon { font-size: 48px; margin-bottom: 16px; }
            .section { margin-bottom: 16px; }
            .label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
            .value { font-size: 16px; font-weight: 600; color: #333; margin-top: 4px; }
            .confirmation { background: linear-gradient(135deg, #FF9933, #138808); color: white; padding: 16px; border-radius: 8px; text-align: center; margin-top: 24px; }
            .confirmation-label { font-size: 12px; opacity: 0.9; }
            .confirmation-id { font-size: 20px; font-weight: bold; letter-spacing: 2px; margin-top: 4px; }
            .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #888; }
            .ashoka { color: #000080; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <div class="icon">✓</div>
              <div class="title">Vote Confirmed</div>
              <div class="subtitle">Electronic Voting Receipt</div>
            </div>
            <div class="section">
              <div class="label">Voter Name</div>
              <div class="value">${voterName}</div>
            </div>
            <div class="section">
              <div class="label">Election</div>
              <div class="value">${electionTitle}</div>
            </div>
            <div class="section">
              <div class="label">Candidate Selected</div>
              <div class="value">${candidateName}</div>
            </div>
            <div class="section">
              <div class="label">Party</div>
              <div class="value">${partyName}</div>
            </div>
            <div class="section">
              <div class="label">Date & Time</div>
              <div class="value">${votedAt.toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'medium' })}</div>
            </div>
            <div class="confirmation">
              <div class="confirmation-label">Confirmation ID</div>
              <div class="confirmation-id">${confirmationId}</div>
            </div>
            <div class="footer">
              <p>This is an official electronic voting receipt.</p>
              <p class="ashoka">🇮🇳 Bharat Votes - Secure Digital Democracy</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Card className="glass-card border-primary/20 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-4 shadow-lg">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <CardTitle className="text-2xl bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">
          Vote Confirmed!
        </CardTitle>
        <p className="text-muted-foreground text-sm">Your vote has been securely recorded</p>
      </CardHeader>

      <CardContent ref={receiptRef} className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide">Voter</p>
            <p className="font-semibold">{voterName}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide">Election</p>
            <p className="font-semibold">{electionTitle}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide">Candidate</p>
            <p className="font-semibold">{candidateName}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide">Party</p>
            <p className="font-semibold">{partyName}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#FF9933]/10 via-white/5 to-[#138808]/10 rounded-lg p-4 text-center border border-primary/10">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Confirmation ID</p>
          <p className="font-mono text-lg font-bold tracking-widest">{confirmationId}</p>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>Voted on: {votedAt.toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}</p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handlePrint} variant="outline" className="flex-1 gap-2">
            <Printer className="w-4 h-4" />
            Print Receipt
          </Button>
          <Button onClick={handlePrint} className="flex-1 gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
