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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  const [results, setResults] = useState<Record<string, number>>({});
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("vote");

  const fetchResults = async () => {
    // compute results either from Supabase or demo_votes in localStorage
    try {
      if (!id) return;
      if (id.toString().startsWith("demo-")) {
        const demoVotesRaw = localStorage.getItem("demo_votes");
        const votes = demoVotesRaw ? JSON.parse(demoVotesRaw) : [];
        const filtered = (votes || []).filter((v: any) => v.election_id === id);
        const counts: Record<string, number> = {};
        filtered.forEach((v: any) => {
          counts[v.candidate_id] = (counts[v.candidate_id] || 0) + 1;
        });
        setResults(counts);
        setTotalVotes(filtered.length);
        return;
      }

      const { data: votesData, error } = await supabase.from("votes").select("*").eq("election_id", id);
      if (error) throw error;
      const counts: Record<string, number> = {};
      (votesData || []).forEach((v: any) => {
        counts[v.candidate_id] = (counts[v.candidate_id] || 0) + 1;
      });
      setResults(counts);
      setTotalVotes((votesData || []).length);
    } catch (err: any) {
      // ignore errors for results but show toast
      console.warn("Error fetching results:", err?.message || err);
      toast({ title: "Error fetching results", description: err?.message || String(err), variant: "destructive" });
    }
  };

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

      if (electionError) {
        // Try demo fallback below
        throw electionError;
      }

      if (electionData) {
        setElection(electionData);
      } else {
        // Supabase returned no data: try demo fallback
        const demoRaw = localStorage.getItem("demo_elections");
        if (demoRaw) {
          try {
            const demo = JSON.parse(demoRaw);
            const found = demo.find((d: any) => d.id === id);
            if (found) {
              setElection(found);
            }
          } catch (e) {
            // ignore
          }
        }
      }

      // Candidates
      try {
        const { data: candidatesData, error: candidatesError } = await supabase
          .from("candidates")
          .select("*")
          .eq("election_id", id);

        if (candidatesError) {
          throw candidatesError;
        }

        if (candidatesData && candidatesData.length > 0) {
          setCandidates(candidatesData || []);
        } else {
          const demoCandRaw = localStorage.getItem("demo_candidates");
          if (demoCandRaw) {
            try {
              const all = JSON.parse(demoCandRaw);
              const filtered = (all || []).filter((c: any) => c.election_id === id);
              setCandidates(filtered);
            } catch (e) {
              // ignore
            }
          }
        }
      } catch (err) {
        // If supabase candidates failed, try demo
        const demoCandRaw = localStorage.getItem("demo_candidates");
        if (demoCandRaw) {
          try {
            const all = JSON.parse(demoCandRaw);
            const filtered = (all || []).filter((c: any) => c.election_id === id);
            setCandidates(filtered);
          } catch (e) {
            // ignore
          }
        }
      }
    } catch (error: any) {
      // Final fallback: if Supabase failed entirely, try demo data
      const demoRaw = localStorage.getItem("demo_elections");
      if (demoRaw) {
        try {
          const demo = JSON.parse(demoRaw);
          const found = demo.find((d: any) => d.id === id);
          if (found) setElection(found);
        } catch (e) {
          // ignore
        }
      }

      const demoCandRaw = localStorage.getItem("demo_candidates");
      if (demoCandRaw) {
        try {
          const all = JSON.parse(demoCandRaw);
          const filtered = (all || []).filter((c: any) => c.election_id === id);
          setCandidates(filtered);
        } catch (e) {
          // ignore
        }
      }

      if (!election) {
        toast({
          title: "Error loading election",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const checkIfVoted = async () => {
    try {
      if (id?.toString().startsWith("demo-")) {
        const demoVotesRaw = localStorage.getItem("demo_votes");
        const votes = demoVotesRaw ? JSON.parse(demoVotesRaw) : [];
        const found = votes.find((v: any) => v.voter_id === user!.id && v.election_id === id);
        setHasVoted(!!found);
        return;
      }

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
      if (id?.toString().startsWith("demo-")) {
        const demoVotesRaw = localStorage.getItem("demo_votes");
        const votes = demoVotesRaw ? JSON.parse(demoVotesRaw) : [];
        const newVote = {
          id: `dv-${Date.now()}`,
          voter_id: user!.id,
          election_id: id,
          candidate_id: selectedCandidate,
          voted_at: new Date().toISOString(),
        };
        votes.push(newVote);
        localStorage.setItem("demo_votes", JSON.stringify(votes));
        toast({
          title: "Vote submitted successfully",
          description: "Thank you for voting!",
        });
        setHasVoted(true);
        setLoading(false);
        return;
      }

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

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(v: string) => { setActiveTab(v); if (v === 'results') fetchResults(); }}>
          <TabsList className="mb-4">
            <TabsTrigger value="vote">Vote</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="vote">
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
                  onClick={async () => {
                    await handleVote();
                    fetchResults();
                    setActiveTab('results');
                  }}
                  disabled={loading || !selectedCandidate}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Submitting..." : "Submit Vote"}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Results</h2>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={fetchResults}>Refresh</Button>
                </div>
              </div>

              <div className="grid gap-4">
                {candidates.map((candidate) => {
                  const count = results[candidate.id] || 0;
                  const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                  return (
                    <Card key={candidate.id} className="glass-card p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{candidate.name}</h3>
                          <p className="text-sm text-muted-foreground">{candidate.party_name}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">{count}</div>
                          <div className="text-sm text-muted-foreground">{pct}%</div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Total votes: {totalVotes}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Elections;
