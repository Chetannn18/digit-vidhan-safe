import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const Elections = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [election, setElection] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchElectionData();
    checkIfVoted();
  }, [user, id, navigate]);

  const fetchElectionData = async () => {
    try {
      const { data: electionData, error: electionError } = await supabase
        .from("elections")
        .select("*")
        .eq("id", id)
        .single();

      if (electionError) throw electionError;
      setElection(electionData);

      const { data: candidatesData, error: candidatesError } = await supabase
        .from("candidates")
        .select("*")
        .eq("election_id", id);

      if (candidatesError) throw candidatesError;
      setCandidates(candidatesData || []);
    } catch (error: any) {
      toast({
        title: "Error loading election",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const checkIfVoted = async () => {
    try {
      const { data, error } = await supabase
        .from("votes")
        .select("*")
        .eq("voter_id", user!.id)
        .eq("election_id", id)
        .maybeSingle();

      if (error) throw error;
      setHasVoted(!!data);
    } catch (error: any) {
      toast({
        title: "Error checking vote status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast({
        title: "No candidate selected",
        description: "Please select a candidate to vote",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("votes").insert({
        voter_id: user!.id,
        election_id: id,
        candidate_id: selectedCandidate,
      });

      if (error) throw error;

      toast({
        title: "Vote submitted successfully",
        description: "Thank you for voting!",
      });
      setHasVoted(true);
    } catch (error: any) {
      toast({
        title: "Error submitting vote",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!election) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <header className="glass-card border-b p-4">
        <div className="container mx-auto">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-6 max-w-4xl">
        <Card className="glass-card p-8 mb-6">
          <h1 className="text-3xl font-bold mb-2">{election.title}</h1>
          <p className="text-muted-foreground">{election.description}</p>
        </Card>

        {hasVoted ? (
          <Card className="glass-card p-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">You have already voted</h2>
            <p className="text-muted-foreground">Thank you for participating in this election!</p>
          </Card>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Select Your Candidate</h2>
            <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
              <div className="grid gap-4">
                {candidates.map((candidate) => (
                  <Card key={candidate.id} className="glass-card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4">
                      <RadioGroupItem value={candidate.id} id={candidate.id} />
                      <Label htmlFor={candidate.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold">{candidate.name}</h3>
                            <p className="text-sm text-muted-foreground">{candidate.party_name}</p>
                            {candidate.description && (
                              <p className="text-sm mt-2">{candidate.description}</p>
                            )}
                          </div>
                          {candidate.party_symbol_url && (
                            <img 
                              src={candidate.party_symbol_url} 
                              alt={candidate.party_name} 
                              className="h-16 w-16 object-contain"
                            />
                          )}
                        </div>
                      </Label>
                    </div>
                  </Card>
                ))}
              </div>
            </RadioGroup>
            <Button 
              onClick={handleVote} 
              disabled={loading || !selectedCandidate}
              className="w-full"
              size="lg"
            >
              {loading ? "Submitting..." : "Submit Vote"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Elections;
