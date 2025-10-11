import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { submissionService, ApiSubmission } from '@/services/submissionService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Code2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Submissions() {
  const [submissions, setSubmissions] = useState<ApiSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      // Assuming submissionService is updated to return ApiSubmission[]
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
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'WA':
      case 'TLE':
      case 'MLE':
      case 'RE':
      case 'CE':
      case 'PE':
      case 'OT':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'P':
        return <Clock className="w-5 h-5 text-yellow-600 animate-pulse" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (verdict: string) => {
    switch (verdict) {
      case 'AC':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'WA':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'TLE':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MLE':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'RE':
      case 'CE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PE':
      case 'OT':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'P':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (verdict: string) => {
    const verdictMap: { [key: string]: string } = {
      'AC': 'Accepted',
      'WA': 'Wrong Answer',
      'TLE': 'Time Limit Exceeded',
      'MLE': 'Memory Limit Exceeded',
      'RE': 'Runtime Error',
      'CE': 'Compilation Error',
      'PE': 'Presentation Error',
      'OT': 'Other',
      'P': 'Pending'
    };
    return verdictMap[verdict] || verdict;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
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
                    {getStatusIcon(submission.verdict)}
                    <div>
                      <CardTitle className="text-lg">
                        {submission.problem_title}
                      </CardTitle>
                      <CardDescription>
                        Submitted on {formatDate(submission.submitted_at)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={getStatusColor(submission.verdict)}>
                      {getStatusText(submission.verdict)}
                    </Badge>
                    <Badge className={getDifficultyColor(submission.problem_difficulty)}>
                      {submission.problem_difficulty}
                    </Badge>
                    <Badge variant="outline">{submission.language}</Badge>
                    {submission.execution_time !== null && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {submission.execution_time}ms
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">User:</span>{' '}
                    <span className="text-muted-foreground">{submission.user_username}</span>
                  </div>
                  <div>
                    <span className="font-medium">Submission ID:</span>{' '}
                    <span className="text-muted-foreground">#{submission.id}</span>
                  </div>
                  <div>
                    <span className="font-medium">Language:</span>{' '}
                    <span className="text-muted-foreground">{submission.language}</span>
                  </div>
                  <div>
                    <span className="font-medium">Difficulty:</span>{' '}
                    <span className="text-muted-foreground capitalize">
                      {submission.problem_difficulty}
                    </span>
                  </div>
                </div>
                
                {/* Note: Since the API response doesn't include code, output, or error_message,
                    these sections have been removed. If you need to display code, you would
                    need to fetch it separately using the submission ID */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}