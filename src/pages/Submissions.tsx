import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { submissionService, ApiSubmission } from '@/services/submissionService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Code2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Submissions() {
  const [submissions, setSubmissions] = useState<ApiSubmission[]>([]);
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

  const getStatusIcon = (verdict: string) => {
    switch (verdict) {
      case 'AC':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'P':
        return <Clock className="w-4 h-4 text-warning animate-pulse" />;
      default:
        return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusVariant = (verdict: string) => {
    switch (verdict) {
      case 'AC':
        return 'bg-success/10 text-success border-success/20';
      case 'P':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-destructive/10 text-destructive border-destructive/20';
    }
  };

  const getStatusText = (verdict: string) => {
    const verdictMap: { [key: string]: string } = {
      'AC': 'Accepted',
      'WA': 'Wrong Answer',
      'TLE': 'Time Limit',
      'MLE': 'Memory Limit',
      'RE': 'Runtime Error',
      'CE': 'Compile Error',
      'PE': 'Presentation Error',
      'OT': 'Other',
      'P': 'Pending'
    };
    return verdictMap[verdict] || verdict;
  };

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-success/10 text-success border-success/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'hard':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Submissions</h1>
        <p className="text-muted-foreground">
          Track your progress and review solutions
        </p>
      </div>

      {submissions.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Code2 className="w-10 h-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">
              No submissions yet
            </p>
            <Link to="/problems">
              <Button>Browse Problems</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {submissions.map((submission) => (
            <Card key={submission.id} className="border-border">
              <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(submission.verdict)}
                    <div>
                      <p className="font-medium text-foreground">
                        {submission.problem_title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(submission.submitted_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={getStatusVariant(submission.verdict)}>
                      {getStatusText(submission.verdict)}
                    </Badge>
                    <Badge variant="outline" className={getDifficultyVariant(submission.problem_difficulty)}>
                      {submission.problem_difficulty}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {submission.language}
                    </Badge>
                    {submission.execution_time !== null && (
                      <Badge variant="secondary" className="text-xs">
                        {submission.execution_time}ms
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
