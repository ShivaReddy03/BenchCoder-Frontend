import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { submissionService, Submission } from '@/services/submissionService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Code2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Submissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const data = await submissionService.listSubmissions();
      setSubmissions(data);
    } catch (error) {
      toast({
        title: 'Failed to load submissions',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'wrong_answer':
      case 'error':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-warning animate-pulse" />;
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-success text-success-foreground';
      case 'wrong_answer':
      case 'error':
        return 'bg-destructive text-destructive-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Submissions</h1>
        <p className="text-muted-foreground">
          Track your progress and review your solutions
        </p>
      </div>

      {submissions.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Code2 className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">
              You haven't submitted any solutions yet
            </p>
            <Link to="/problems">
              <Button className="gradient-primary">Browse Problems</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission.id} className="shadow-card hover:shadow-glow transition-all">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(submission.status)}
                    <div>
                      <CardTitle>Problem #{submission.problem}</CardTitle>
                      <CardDescription>
                        Submitted on {formatDate(submission.created_at)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={getStatusColor(submission.status)}>
                      {submission.status?.replace('_', ' ') || 'Unknown'}
                    </Badge>
                    <Badge variant="outline">{submission.language}</Badge>
                    {submission.score !== undefined && (
                      <Badge className="bg-primary text-primary-foreground">
                        Score: {submission.score}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Code:</h4>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{submission.code}</code>
                    </pre>
                  </div>
                  {submission.output && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Output:</h4>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{submission.output}</code>
                      </pre>
                    </div>
                  )}
                  {submission.error_message && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-destructive">Error:</h4>
                      <pre className="bg-destructive/10 p-4 rounded-lg overflow-x-auto text-sm text-destructive">
                        <code>{submission.error_message}</code>
                      </pre>
                    </div>
                  )}
                  {submission.execution_time !== undefined && (
                    <p className="text-sm text-muted-foreground">
                      Execution time: {submission.execution_time}ms
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
