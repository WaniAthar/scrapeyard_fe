import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail, resendVerification } from "../api/auth-api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const emailParam = searchParams.get("email");
    
    if (emailParam) {
      setEmail(emailParam);
    }

    const verify = async () => {
      if (!token) {
        setError("No verification token provided");
        setIsLoading(false);
        return;
      }

      try {
        await verifyEmail(token);
        toast.success("Email verified successfully! You can now log in.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err: any) {
        console.error("Verification failed:", err);
        setError(err.message || "Failed to verify email. The link may have expired or is invalid.");
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [searchParams, navigate]);

  const handleResendVerification = async () => {
    if (!email) return;
    
    try {
      await resendVerification(email);
      toast.success("Verification email resent successfully!");
    } catch (err: any) {
      console.error("Failed to resend verification:", err);
      toast.error(err.message || "Failed to resend verification email");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
              <CardTitle>Verifying Your Email</CardTitle>
              <CardDescription>
                Please wait while we verify your email address.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                <Check className="h-6 w-6" />
              </div>
              <CardTitle>Email Verified Successfully!</CardTitle>
              <CardDescription>
                Your email has been verified successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                You will be redirected to the login page shortly.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                onClick={() => navigate("/login")} 
                className="w-full"
              >
                Go to Login
              </Button>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <CardTitle>Verification Failed</CardTitle>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Please try again or contact support if the problem persists.
            </p>
          </CardContent>
          {email && (
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                onClick={handleResendVerification}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Resend Verification Email'}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/login")}
                className="w-full"
              >
                Back to Login
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default EmailVerification;
