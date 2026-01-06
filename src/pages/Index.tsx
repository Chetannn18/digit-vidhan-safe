import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Vote, Lock, Users, HelpCircle, BarChart3, FileCheck, Clock } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">
              Bharat Vote
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate("/help")}>
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
            <ThemeToggle />
            <Button onClick={() => navigate("/auth")}>Login</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="glass-card max-w-4xl mx-auto p-12 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
          <Shield className="h-20 w-20 text-primary mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FF9933] via-primary to-[#138808] bg-clip-text text-transparent">
            Bharat Vote
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Secure, Transparent, and Democratic Digital Voting System
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-lg px-8">
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose Bharat Vote?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="glass-card p-8 text-center hover:shadow-xl transition-shadow">
            <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">Secure Authentication</h3>
            <p className="text-muted-foreground">
              Government ID verification ensures only eligible voters can participate
            </p>
          </Card>
          
          <Card className="glass-card p-8 text-center hover:shadow-xl transition-shadow">
            <Vote className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">Transparent Process</h3>
            <p className="text-muted-foreground">
              Every vote is securely recorded and verifiable while maintaining privacy
            </p>
          </Card>
          
          <Card className="glass-card p-8 text-center hover:shadow-xl transition-shadow">
            <Users className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">Democratic Access</h3>
            <p className="text-muted-foreground">
              Easy-to-use platform accessible to all citizens from anywhere
            </p>
          </Card>
        </div>
      </section>

      {/* New Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-4">New Features</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Enhanced voting experience with real-time updates, visual analytics, and instant verification
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF9933]/20 to-[#FF9933]/5 flex items-center justify-center mx-auto mb-4">
              <FileCheck className="h-7 w-7 text-[#FF9933]" />
            </div>
            <h3 className="text-lg font-bold mb-2">Vote Receipt</h3>
            <p className="text-sm text-muted-foreground">
              Get a printable receipt with confirmation ID after voting
            </p>
          </Card>
          
          <Card className="glass-card p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#138808]/20 to-[#138808]/5 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-7 w-7 text-[#138808]" />
            </div>
            <h3 className="text-lg font-bold mb-2">Live Countdown</h3>
            <p className="text-sm text-muted-foreground">
              Real-time countdown timers for upcoming and ongoing elections
            </p>
          </Card>
          
          <Card className="glass-card p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Visual Results</h3>
            <p className="text-sm text-muted-foreground">
              Interactive charts showing election results and vote distribution
            </p>
          </Card>
          
          <Card className="glass-card p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="h-7 w-7 text-secondary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Help Center</h3>
            <p className="text-sm text-muted-foreground">
              FAQs, voting guidelines, and 24/7 support during elections
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="glass-card max-w-3xl mx-auto p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF9933]/5 via-transparent to-[#138808]/5" />
          <div className="relative">
            <h2 className="text-3xl font-bold mb-4">Ready to Make Your Voice Heard?</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Join millions of citizens exercising their democratic right through our secure platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
                Register to Vote
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/help")} className="text-lg px-8">
                Learn More
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="glass-card border-t mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold">Bharat Vote</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <button onClick={() => navigate("/help")} className="hover:text-foreground transition-colors">
                Help Center
              </button>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Bharat Vote. Empowering democracy.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
