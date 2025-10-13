import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Vote, Lock, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="glass-card max-w-4xl mx-auto p-12 rounded-2xl">
          <Shield className="h-20 w-20 text-primary mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
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

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="glass-card max-w-3xl mx-auto p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Make Your Voice Heard?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Join millions of citizens exercising their democratic right through our secure platform
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
            Register to Vote
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="glass-card border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 Bharat Vote. Empowering democracy through technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
