import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ShieldCheck,
  Vote,
  UserCheck,
  Clock,
  Phone,
  Mail,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Scale,
} from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

const faqs = [
  {
    question: "Who is eligible to vote in Indian elections?",
    answer:
      "Any Indian citizen who is 18 years or older on the qualifying date and has registered as a voter in their constituency is eligible to vote. You must have a valid Voter ID (EPIC) or any of the 12 alternate photo ID documents approved by ECI.",
  },
  {
    question: "What documents can I use for voter verification?",
    answer:
      "You can use your Voter ID (EPIC), Aadhaar Card, PAN Card, Passport, Driving License, Service ID cards for government employees, Smart Card issued by RGI under NPR, MNREGA Job Card, Health Insurance Smart Card, Bank/Post Office Passbook with photo, or Official identity cards issued by State/Central Government.",
  },
  {
    question: "How is my vote kept secret and secure?",
    answer:
      "Your vote is protected through end-to-end encryption, secure voting protocols, and blockchain verification. The system uses multi-factor authentication and your vote is anonymized to ensure no one can trace your ballot back to you while maintaining a verifiable audit trail.",
  },
  {
    question: "Can I change my vote after submitting?",
    answer:
      "No, once you submit your vote, it cannot be changed. This is to maintain the integrity of the electoral process. Please review your selection carefully before confirming your vote.",
  },
  {
    question: "What should I do if I face technical issues while voting?",
    answer:
      "If you encounter technical issues, first try refreshing the page. If the problem persists, contact our 24/7 helpline at 1950 or email support@bharatvotes.gov.in. Document any error messages and your voter ID for quick resolution.",
  },
  {
    question: "How can I verify my vote was counted?",
    answer:
      "After voting, you receive a unique confirmation ID. You can use this ID to verify your vote was recorded in the blockchain without revealing your choice. Visit the 'Verify Vote' section with your confirmation ID.",
  },
  {
    question: "What are the voting hours?",
    answer:
      "Online voting is available 24/7 during the election period. However, the election has specific start and end dates. Make sure to cast your vote before the deadline shown on your election page.",
  },
  {
    question: "Can I vote from outside my registered constituency?",
    answer:
      "Yes, online voting allows you to cast your vote from anywhere in India or even abroad, as long as you have a valid internet connection and your verified credentials. This is one of the key advantages of digital voting.",
  },
];

const guidelines = [
  {
    icon: UserCheck,
    title: "Verify Your Identity",
    description: "Ensure your Voter ID and government documents are ready before starting the voting process.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Connection",
    description: "Always vote from a secure, private network. Avoid public WiFi or shared computers.",
  },
  {
    icon: Vote,
    title: "Review Before Submit",
    description: "Double-check your candidate selection before confirming. Votes cannot be changed once submitted.",
  },
  {
    icon: FileText,
    title: "Save Your Receipt",
    description: "Download or print your vote receipt. Keep the confirmation ID safe for verification.",
  },
];

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">
                Help Center
              </h1>
              <p className="text-sm text-muted-foreground">Voter Assistance & Support</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* Quick Contact */}
        <Card className="glass-card border-primary/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF9933]/5 via-transparent to-[#138808]/5" />
          <CardContent className="relative p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF9933] to-[#138808] flex items-center justify-center shadow-lg">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold mb-2">Need Immediate Help?</h2>
                <p className="text-muted-foreground">Our support team is available 24/7 during elections</p>
              </div>
              <div className="flex flex-col gap-2">
                <Badge variant="outline" className="text-lg py-2 px-4 justify-center">
                  <Phone className="w-4 h-4 mr-2" />
                  1950 (Toll Free)
                </Badge>
                <Badge variant="outline" className="py-2 px-4 justify-center">
                  <Mail className="w-4 h-4 mr-2" />
                  support@bharatvotes.gov.in
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voting Guidelines */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Voting Guidelines</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {guidelines.map((guide, index) => (
              <Card key={index} className="glass-card hover:shadow-lg transition-shadow">
                <CardContent className="p-4 flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <guide.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{guide.title}</h3>
                    <p className="text-sm text-muted-foreground">{guide.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Eligibility Checklist */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <CardTitle>Voter Eligibility Checklist</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Indian citizen aged 18 years or above",
              "Registered in the electoral roll",
              "Valid Voter ID (EPIC) or approved alternate ID",
              "Verified government-issued photo identification",
              "Not disqualified under any law for voting",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* FAQs */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
          </div>
          <Card className="glass-card">
            <CardContent className="p-4">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* Important Links */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Important Resources</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: "Election Laws", icon: Scale, desc: "Legal framework" },
              { title: "Model Code", icon: FileText, desc: "Conduct guidelines" },
              { title: "Report Issues", icon: AlertCircle, desc: "File complaints" },
            ].map((item, index) => (
              <Card key={index} className="glass-card hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Info */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Election Commission of India</h3>
              <p className="text-sm text-muted-foreground">
                Nirvachan Sadan, Ashoka Road
                <br />
                New Delhi - 110001
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>1950 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>complaints@eci.gov.in</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>24/7 during elections</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
