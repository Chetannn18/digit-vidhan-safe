import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { Vote, Calendar, User as UserIcon, LogOut } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activeElections, setActiveElections] = useState<any[]>([]);

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

    fetchProfile();
    fetchElections();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();

      if (error) throw error;
      setProfile(data);
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
      setActiveElections(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading elections",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user || !profile) {
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
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
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
                    onClick={() => navigate(`/elections/${election.id}`)}
                  >
                    Vote Now
                  </Button>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
