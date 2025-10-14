import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { Vote, Calendar, User as UserIcon, LogOut, CheckCircle2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [activeElections, setActiveElections] = useState<any[]>([]);
  const [candidateDialogOpen, setCandidateDialogOpen] = useState(false);
  const [selectedElection, setSelectedElection] = useState<any | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [hasVoted, setHasVoted] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [submittingVote, setSubmittingVote] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchProfile();
    fetchElections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const meta = user!.user_metadata as Record<string, any>;
        const hasRequired = meta?.full_name && meta?.government_id && meta?.government_id_type && meta?.date_of_birth;
        if (!hasRequired) {
          toast({
            title: "Profile incomplete",
            description: "Please complete your registration details.",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }

        const { data: created, error: upsertError } = await supabase
          .from("profiles")
          .insert({
            id: user!.id,
            full_name: meta.full_name,
            government_id: meta.government_id,
            government_id_type: meta.government_id_type,
            date_of_birth: meta.date_of_birth,
          })
          .select()
          .single();

        if (upsertError) throw upsertError;
        setProfile(created);
      } else {
        setProfile(data);
      }
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchElections = async () => {
    try {
      const { data, error } = await supabase
        .from("elections")
        .select("*")
        .eq("is_active", true)
        .order("start_date", { ascending: true });

      if (error) throw error;

      // If there are no elections in Supabase, fall back to demo elections stored in localStorage
      if (!data || (Array.isArray(data) && data.length === 0)) {
        const demo = localStorage.getItem("demo_elections");
        if (demo) {
          try {
            const parsed = JSON.parse(demo);
            setActiveElections(parsed || []);
            return;
          } catch (e) {
            // ignore parse errors and continue
          }
        }
      }

      setActiveElections(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading elections",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openCandidates = async (election: any) => {
    setSelectedElection(election);
    setCandidates([]);
    setSelectedCandidate("");
    setHasVoted(false);
    setCandidateDialogOpen(true);
    setLoadingCandidates(true);

    try {
      // Check if user has already voted
      if (election.id?.toString().startsWith("demo-")) {
        const demoVotesRaw = localStorage.getItem("demo_votes");
        const votes = demoVotesRaw ? JSON.parse(demoVotesRaw) : [];
        const found = votes.find((v: any) => v.voter_id === user!.id && v.election_id === election.id);
        setHasVoted(!!found);
      } else {
        const { data: existing, error: existErr } = await supabase
          .from("votes")
          .select("*")
          .eq("voter_id", user!.id)
          .eq("election_id", election.id)
          .maybeSingle();
        if (existErr && existErr.code !== "PGRST116") throw existErr; // ignore "not found"
        setHasVoted(!!existing);
      }

      // Load candidates
      if (election.id?.toString().startsWith("demo-")) {
        const demoCandRaw = localStorage.getItem("demo_candidates");
        const all = demoCandRaw ? JSON.parse(demoCandRaw) : [];
        const filtered = (all || []).filter((c: any) => c.election_id === election.id);
        setCandidates(filtered);
      } else {
        const { data: candidatesData, error } = await supabase
          .from("candidates")
          .select("*")
          .eq("election_id", election.id);
        if (error) throw error;
        if (candidatesData && candidatesData.length > 0) {
          setCandidates(candidatesData);
        } else {
          const demoCandRaw = localStorage.getItem("demo_candidates");
          const all = demoCandRaw ? JSON.parse(demoCandRaw) : [];
          const filtered = (all || []).filter((c: any) => c.election_id === election.id);
          setCandidates(filtered);
        }
      }
    } catch (err: any) {
      toast({ title: "Error loading candidates", description: err?.message || String(err), variant: "destructive" });
    } finally {
      setLoadingCandidates(false);
    }
  };

  const submitVote = async () => {
    if (!selectedElection) return;
    if (!selectedCandidate) {
      toast({ title: "No candidate selected", description: "Please select a candidate", variant: "destructive" });
      return;
    }
    setSubmittingVote(true);
    try {
      const id = selectedElection.id;
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
        toast({ title: "Vote submitted", description: "Thank you for voting!" });
        setHasVoted(true);
        setCandidateDialogOpen(false);
        return;
      }

      const { error } = await supabase.from("votes").insert({
        voter_id: user!.id,
        election_id: id,
        candidate_id: selectedCandidate,
      });
      if (error) throw error;
      toast({ title: "Vote submitted", description: "Thank you for voting!" });
      setHasVoted(true);
      setCandidateDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Error submitting vote", description: err?.message || String(err), variant: "destructive" });
    } finally {
      setSubmittingVote(false);
    }
  };

  const createDemoElections = () => {
    const demoElections = [
      {
        id: "demo-1",
        title: "Community Council Election",
        description: "Test election for community council representatives.",
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
      },
      {
        id: "demo-2",
        title: "Neighborhood Cleanup Committee",
        description: "Vote for the best candidates to lead our neighborhood cleanup.",
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
      },
    ];

    const demoCandidates = [
      { id: "demo-1-c1", name: "modi ji ", party_name: "kamal ka fhul", election_id: "demo-1" },
      { id: "demo-1-c2", name: "Rahul gandhi", party_name: "hath panja", election_id: "demo-1" },
      { id: "demo-2-c1", name: "yogi ji", party_name: "kesari rang", election_id: "demo-2" },
      { id: "demo-2-c2", name: "chetan nagre", party_name: "kuch nhi karna ", election_id: "demo-2" },
    ];

    localStorage.setItem("demo_elections", JSON.stringify(demoElections));
    localStorage.setItem("demo_candidates", JSON.stringify(demoCandidates));
    toast({ title: "Demo elections created", description: "Temporary elections available for testing." });
    setActiveElections(demoElections);
  };


  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (authLoading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <header className="glass-card border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Bharat Vote Dashboard
          </h1>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" onClick={createDemoElections}>
              Create Demo Elections
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-6">
        <Card className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <UserIcon className="h-12 w-12 text-primary" />
            <div>
              <h2 className="text-2xl font-bold">{profile.full_name}</h2>
              <p className="text-muted-foreground">
                {profile.government_id_type.toUpperCase()}: {profile.government_id}
              </p>
            </div>
          </div>
        </Card>

        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Vote className="mr-2 h-6 w-6 text-primary" />
            Active Elections
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeElections.length === 0 ? (
              <Card className="glass-card p-6 col-span-full text-center">
                <p className="text-muted-foreground">No active elections at the moment</p>
              </Card>
            ) : (
              activeElections.map((election) => (
                <Card key={election.id} className="glass-card p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold mb-2">{election.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{election.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(election.start_date).toLocaleDateString()} - {new Date(election.end_date).toLocaleDateString()}
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => openCandidates(election)}
                  >
                    Vote Now
                  </Button>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <Dialog open={candidateDialogOpen} onOpenChange={setCandidateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedElection ? `Vote: ${selectedElection.title}` : "Vote"}
            </DialogTitle>
            {selectedElection && (
              <DialogDescription>
                {new Date(selectedElection.start_date).toLocaleDateString()} - {new Date(selectedElection.end_date).toLocaleDateString()}
              </DialogDescription>
            )}
          </DialogHeader>

          {loadingCandidates ? (
            <div className="py-8 text-center">Loading candidates...</div>
          ) : hasVoted ? (
            <Card className="glass-card p-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-secondary mx-auto mb-2" />
              <h3 className="text-xl font-bold mb-1">You have already voted</h3>
              <p className="text-muted-foreground">Thank you for participating!</p>
            </Card>
          ) : candidates.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">No candidates found for this election.</div>
          ) : (
            <div className="space-y-4">
              <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
                <div className="grid gap-3">
                  {candidates.map((candidate) => (
                    <Card key={candidate.id} className="glass-card p-4">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={candidate.id} id={candidate.id} />
                        <Label htmlFor={candidate.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">{candidate.name}</div>
                              <div className="text-sm text-muted-foreground">{candidate.party_name}</div>
                              {candidate.description && (
                                <p className="text-sm mt-1">{candidate.description}</p>
                              )}
                            </div>
                            {candidate.party_symbol_url && (
                              <img src={candidate.party_symbol_url} alt={candidate.party_name} className="h-10 w-10 object-contain" />
                            )}
                          </div>
                        </Label>
                      </div>
                    </Card>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          <DialogFooter>
            <div className="flex w-full gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setCandidateDialogOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={submitVote} disabled={submittingVote || !selectedCandidate || hasVoted || loadingCandidates}>
                {submittingVote ? "Submitting..." : "Submit Vote"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
