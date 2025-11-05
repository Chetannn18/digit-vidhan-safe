import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Shield, CheckCircle2, Phone } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [governmentId, setGovernmentId] = useState("");
  const [governmentIdType, setGovernmentIdType] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // OTP verification
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!fullName || !governmentId || !governmentIdType || !dateOfBirth || !phoneNumber) {
        throw new Error("Please fill all required fields");
      }

      // Validate phone number (basic check for 10 digits)
      if (!/^\d{10}$/.test(phoneNumber)) {
        throw new Error("Please enter a valid 10-digit phone number");
      }

      // Generate a simple 6-digit OTP (in production, this should be done server-side)
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      setShowOtpStep(true);

      // In production, send OTP via SMS service
      console.log("OTP sent to", phoneNumber, ":", newOtp);

      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${phoneNumber}. (Demo: ${newOtp})`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);

    try {
      if (otp !== generatedOtp) {
        throw new Error("Invalid OTP. Please try again.");
      }

      const { error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            government_id: governmentId,
            government_id_type: governmentIdType,
            date_of_birth: dateOfBirth,
            phone_number: phoneNumber,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Registration successful",
        description: "Your account has been verified and created!",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 glass-card shadow-2xl animate-in fade-in duration-500">
        <div className="flex flex-col items-center justify-center mb-8 space-y-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent blur-xl opacity-50"></div>
            <Shield className="h-16 w-16 text-primary relative" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Secure Vote
          </h1>
          <p className="text-sm text-muted-foreground">Your vote, your voice</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            {!showOtpStep ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    type="text"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="transition-all focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-number" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone-number"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    required
                    maxLength={10}
                    className="transition-all focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gov-id-type">Government ID Type</Label>
                  <Select value={governmentIdType} onValueChange={setGovernmentIdType} required>
                    <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/50">
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="voter_id">Voter ID</SelectItem>
                      <SelectItem value="aadhaar">Aadhaar</SelectItem>
                      <SelectItem value="pan">PAN</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gov-id">Government ID Number</Label>
                  <Input
                    id="gov-id"
                    type="text"
                    placeholder="Enter your ID number"
                    value={governmentId}
                    onChange={(e) => setGovernmentId(e.target.value)}
                    required
                    className="transition-all focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    className="transition-all focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className="transition-all focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    minLength={6}
                    className="transition-all focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all" 
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send Verification Code"}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <CheckCircle2 className="h-12 w-12 text-secondary mx-auto" />
                  <h3 className="text-lg font-semibold">Verify Your Number</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to {phoneNumber}
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="border-primary/50" />
                      <InputOTPSlot index={1} className="border-primary/50" />
                      <InputOTPSlot index={2} className="border-primary/50" />
                      <InputOTPSlot index={3} className="border-primary/50" />
                      <InputOTPSlot index={4} className="border-primary/50" />
                      <InputOTPSlot index={5} className="border-primary/50" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={handleVerifyOtp} 
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all" 
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? "Verifying..." : "Verify & Register"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowOtpStep(false);
                      setOtp("");
                    }} 
                    className="w-full"
                  >
                    Back to Form
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
