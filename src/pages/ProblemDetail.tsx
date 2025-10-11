import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { problemService, Problem } from '@/services/problemService';
import { submissionService } from '@/services/submissionService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Loader2, Send, Trophy, ArrowLeft, Code2 } from 'lucide-react';

export default function ProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');

  useEffect(() => {
    loadProblem();
  }, [id]);

  const loadProblem = async () => {
    if (!id) return;
    
    try {
      const data = await problemService.getProblem(parseInt(id));
      setProblem(data);
      setCode(getDefaultCode(language));
    } catch (error) {
      toast({
        title: 'Failed to load problem',
        description: 'Please try again later',
        variant: 'destructive',
      });
      navigate('/problems');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultCode = (lang: string) => {
    switch (lang) {
      case 'python':
        return '# Write your solution here\n\ndef solution():\n    pass\n\nsolution()';
      case 'javascript':
        return '// Write your solution here\n\nfunction solution() {\n  \n}\n\nsolution();';
      case 'java':
        return '// Write your solution here\n\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}';
      default:
        return '';
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (!code || code === getDefaultCode(language)) {
      setCode(getDefaultCode(newLanguage));
    }
  };

  const handleSubmit = async () => {
    if (!id || !code.trim()) {
      toast({
        title: 'Invalid submission',
        description: 'Please write some code before submitting',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const submission = await submissionService.createSubmission({
        problem: parseInt(id),
        code,
        language,
      });

      toast({
        title: 'Submission successful!',
        description: `Status: ${submission.status || 'Processing'}`,
      });

      navigate('/submissions');
    } catch (error: any) {
      toast({
        title: 'Submission failed',
        description: error.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-difficulty-easy text-success-foreground';
      case 'medium':
        return 'bg-difficulty-medium text-warning-foreground';
      case 'hard':
        return 'bg-difficulty-hard text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!problem) return null;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <Button
        variant="outline"
        onClick={() => navigate('/problems')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Problems
      </Button>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Problem Description */}
        <Card className="shadow-card h-fit">
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <CardTitle className="text-2xl">{problem.title}</CardTitle>
              <Badge className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="w-4 h-4 text-primary" />
              <span>{problem.points} points</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <p className="text-foreground whitespace-pre-wrap">{problem.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Code Editor */}
        <div className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  <CardTitle>Code Editor</CardTitle>
                </div>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>Write your solution below</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono min-h-[400px] bg-muted/50"
                placeholder="Write your code here..."
                disabled={submitting}
              />
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full mt-4 gradient-primary"
              >
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {submitting ? 'Submitting...' : 'Submit Solution'}
                {!submitting && <Send className="w-4 h-4 ml-2" />}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
